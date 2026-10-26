export interface ClientPartner {
  id: string;
  name: string;
  image: string;
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  { id: 'pvoil', name: 'PVOIL', image: '/images/vietlabel/clients/pvoil.png' },
  { id: 'agimexpharm', name: 'Agimexpharm', image: '/images/vietlabel/clients/agimexpharm.png' },
  { id: 'nutifood', name: 'Nutifood', image: '/images/vietlabel/clients/nutifood.png' },
  { id: 'th-true-milk', name: 'TH true MILK', image: '/images/vietlabel/clients/th-true-milk.png' },
  { id: 'hyosung', name: 'Hyosung', image: '/images/vietlabel/clients/hyosung.png' },
  { id: 'ttc', name: 'TTC', image: '/images/vietlabel/clients/ttc.png' },
  { id: 'abbott', name: 'Abbott', image: '/images/vietlabel/clients/abbott.png' },
  { id: 'nuti-kd', name: 'Nuti Kđ', image: '/images/vietlabel/clients/nuti-kd.png' },
  { id: 'michelin', name: 'Michelin', image: '/images/vietlabel/clients/michelin.png' },
  { id: 'thien-long', name: 'Thiên Long', image: '/images/vietlabel/clients/thien-long.png' },
  { id: 'achaupharm', name: 'Achaupharm', image: '/images/vietlabel/clients/achaupharm.png' },
  { id: 'cj-foods', name: 'CJ Foods', image: '/images/vietlabel/clients/cj-foods.png' },
];

export const CLIENT_ROW_1 = CLIENT_PARTNERS.slice(0, 6);
export const CLIENT_ROW_2 = CLIENT_PARTNERS.slice(6, 12);
