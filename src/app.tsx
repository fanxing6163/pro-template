import avatar from '@/assets/images/avatar.gif';
import { AvatarDropdown, AvatarName, ChangeNavTheme } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import { LinkOutlined } from '@ant-design/icons';
import {
  Settings as LayoutSettings,
  ProBreadcrumb,
  SettingDrawer,
} from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import 'dayjs/locale/zh-cn';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { LocalStorage, NAV_THEME } from './utils';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const localNavTheme = LocalStorage.get(NAV_THEME);
  const settings = {
    ...defaultSettings,
    navTheme: ['realDark', 'light'].includes(localNavTheme)
      ? localNavTheme
      : defaultSettings.navTheme,
  } as Partial<LayoutSettings>;
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings,
    };
  }
  return {
    fetchUserInfo,
    settings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    ...initialState?.settings,
    locale: 'zh-CN',
    actionsRender: () => [<ChangeNavTheme key="theme" />],
    avatarProps: {
      src: avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    menu: {
      autoClose: false,
      locale: false,
    },
    headerContentRender: () => <ProBreadcrumb />,
    breadcrumbProps: {
      itemRender: (route) => route.breadcrumbName,
    },
    childrenRender: (children) => {
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
