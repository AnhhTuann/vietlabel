import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/store';
import { User, UserRole } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'vietlabel_secret_key_crm_2026_super_secure';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authService = {
  signToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Date.now() + TOKEN_EXPIRY_MS,
    };

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  },

  verifyToken(token: string): AuthTokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const [header, body, signature] = parts;

      const expectedSig = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        return null;
      }

      const payload: AuthTokenPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
      if (payload.exp < Date.now()) {
        return null;
      }

      return payload;
    } catch (err) {
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = db.users.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    if (!user.active) {
      throw new Error('Tài khoản đã bị tạm khóa bởi quản trị viên.');
    }

    // Check account lockout
    if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
      const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / (60 * 1000));
      throw new Error(`Tài khoản tạm thời bị khóa do nhập sai quá 5 lần. Vui lòng thử lại sau ${remainingMinutes} phút.`);
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      const failedCount = (user.failedLoginAttempts || 0) + 1;
      let lockedUntil: string | undefined = undefined;

      if (failedCount >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      }

      db.users.update(user.id, {
        failedLoginAttempts: failedCount,
        lockedUntil,
      });

      if (failedCount >= MAX_FAILED_ATTEMPTS) {
        throw new Error('Bạn đã nhập sai mật khẩu 5 lần. Tài khoản tạm khóa 15 phút.');
      }

      throw new Error(`Mật khẩu không chính xác. Bạn còn ${MAX_FAILED_ATTEMPTS - failedCount} lần thử.`);
    }

    // Reset failed attempts on success
    db.users.update(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: undefined,
    });

    const token = this.signToken(user);
    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  },

  middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let token = '';

    // Check Authorization header Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers.cookie) {
      // Check httpOnly cookie
      const match = req.headers.cookie.match(/vietlabel_auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập để truy cập tài nguyên này.' });
    }

    const payload = authService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' });
    }

    const user = db.users.findById(payload.userId);
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa.' });
    }

    req.user = user;
    next();
  },

  requireRole(allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Chưa đăng nhập.' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: `Bạn không có quyền thực hiện hành động này. Yêu cầu quyền: ${allowedRoles.join(', ')}.`,
        });
      }

      next();
    };
  },
};
