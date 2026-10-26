import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { matchApprovedFaqAnswer } from '../server/lib/rag';

describe('reviewed FAQ knowledge retrieval', () => {
  const chunks = [
    {
      id: 'faq-1',
      source: 'approved-faq.md',
      title: 'Câu hỏi: MOQ tối thiểu của tem decal là bao nhiêu?',
      content: '## Câu hỏi: MOQ tối thiểu của tem decal là bao nhiêu?\n\n**Trả lời:** MOQ tùy theo quy cách và công nghệ sản xuất.',
      keywords: ['moq', 'tem', 'decal'],
    },
    {
      id: 'faq-draft',
      source: 'draft.md',
      title: 'Câu hỏi: MOQ thùng carton',
      content: '**Trả lời:** nội dung nháp',
      keywords: [],
    },
  ];

  it('answers only from an approved FAQ that matches the customer question', () => {
    assert.deepEqual(
      matchApprovedFaqAnswer('MOQ tem decal bên mình tối thiểu bao nhiêu?', chunks),
      {
        answer: 'MOQ tùy theo quy cách và công nghệ sản xuất.',
        source: 'approved-faq.md',
      },
    );
    assert.equal(matchApprovedFaqAnswer('Chính sách đổi trả như thế nào?', chunks), null);
  });
});
