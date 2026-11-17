// Fotos gratuitas do Unsplash usadas como placeholder nos templates.
export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PEOPLE = [
  img("1580489944761-15a19d654956", 400),
  img("1625241152315-4a698f74ceb7", 400),
  img("1611695434369-a8f5d76ceb7b", 400),
  img("1662850886700-4ec19bd30d11", 400),
  img("1757744705465-ea08b0ddc38a", 400),
  img("1562337404-3044c84ac061", 400),
  img("1592234789031-94bf65f630ed", 400),
];

export const GENERIC = [
  img("1567880905822-56f8e06fe630"),
  img("1629909613654-28e377c37b09"),
  img("1770230901556-4e1c0bacfb09"),
];
