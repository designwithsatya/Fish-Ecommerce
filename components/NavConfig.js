import SvgColor from './svg-color';

const getIcon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: '/',
    icon: getIcon('ic_analytics'),
  },
  {
    title: 'Contact',
    path: '/contact',
    icon: getIcon('ic_user'),
  },
  {
    title: 'About',
    path: '/about',
    icon: getIcon('ic_about'),
  },
  {
    title: 'Services',
    path: '/service',
    icon: getIcon('ic_cart'),
  },
  {
    title: 'Blogs',
    path: '/blogs',
    icon: getIcon('ic_blog'),
  },
  {
    title: 'Preview',
    path: '/preview',
    icon: getIcon('ic_preview'),
  },
];

export default navConfig;
