// component
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Order',
    path: '/admin/orders',
    icon: icon('ic_order'),
  },
  {
    title: 'Product',
    path: '/admin/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: icon('ic_user'),
  },
];

export default navConfig;
