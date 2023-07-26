import moon from '@/assets/images/moon.png';
import sun from '@/assets/images/sun.png';
import { LocalStorage, NAV_THEME } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang, useModel } from '@umijs/max';
import { Switch } from 'antd';

export const ChangeNavTheme = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  return (
    <div>
      <Switch
        checkedChildren={<img src={moon} width={18} height={18} />}
        unCheckedChildren={<img src={sun} width={18} height={18} />}
        checked={initialState?.settings?.navTheme === 'realDark'}
        onChange={(checked) => {
          setInitialState((pred: any) => ({
            ...(pred || {}),
            settings: { ...pred?.settings, navTheme: checked ? 'realDark' : 'light' },
          }));
          LocalStorage.set(NAV_THEME, checked ? 'realDark' : 'light');
        }}
      />
    </div>
  );
};

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
