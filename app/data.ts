// ========== 共享数据 ==========

export interface LogoItem {
  id: number;
  name: string;
  website: string;
  imageUrl: string;
}

// 用对象包裹，确保引用不变
export const logoData = {
  logos: [
    { id: 1, name: 'TechCorp', website: 'techcorp.com', imageUrl: '' },
    { id: 2, name: 'GlobalTrade', website: 'globaltrade.com', imageUrl: '' },
    { id: 3, name: 'MegaBuy', website: 'megabuy.com', imageUrl: '' },
  ] as LogoItem[],
  nextId: 4,
};

export function addLogo(logo: LogoItem) {
  logoData.logos.push(logo);
  logoData.nextId++;
}

export function updateLogo(id: number, name: string, website: string) {
  const logo = logoData.logos.find((l) => l.id === id);
  if (logo) {
    logo.name = name;
    logo.website = website;
  }
}

export function deleteLogo(id: number) {
  logoData.logos = logoData.logos.filter((l) => l.id !== id);
}

// 视频数据
export const videos = [
  {
    id: '1',
    title: 'PCB Assembly Line - First Person Tour',
    factoryName: 'Shenzhen Tech Electronics',
    productType: 'Electronics Manufacturing',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '4:05',
  },
  {
    id: '2',
    title: 'Garment Production - From Fabric to Finished',
    factoryName: 'Guangzhou Textile Co.',
    productType: 'Textile & Apparel',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:09',
  },
  {
    id: '3',
    title: 'CNC Machining Process - Precision Parts',
    factoryName: 'Dongguan Precision Mfg',
    productType: 'Machinery & Parts',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '5:12',
  },
  {
    id: '4',
    title: 'LED Display Assembly Workshop Tour',
    factoryName: 'Shenzhen Optoelectronics',
    productType: 'Electronics',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:18',
  },
  {
    id: '5',
    title: 'Stainless Steel Kitchenware Production',
    factoryName: 'Yongkang Metalworks',
    productType: 'Kitchenware',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '4:27',
  },
  {
    id: '6',
    title: 'Injection Molding - Plastic Parts Factory',
    factoryName: 'Ningbo Plastics Co.',
    productType: 'Plastic Manufacturing',
    previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:54',
  },
];