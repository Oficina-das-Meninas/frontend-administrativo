export interface NavItem {
  matIcon?: string;
  title?: string;
  path?: string;
  action?: () => void;
  category?: string;
  isCategory?: boolean;
  position?: 'bottom';
}
