import { useNavigation, useLocation } from 'react-router-dom';

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';

// 获取导航期间，loading 的状态（数据回显的状态） pathname是可选参数，有就用，没有就不用，这样hook就更通用一些
export const useNavLoading = (method: Method, pathname?: string) => {
  const navigation = useNavigation();
  const location = useLocation();

  const loading =
    navigation.state === 'loading' &&
    navigation.formMethod?.toUpperCase() === method &&
    navigation.formAction === (pathname || location.pathname);

  return loading;
};

// 获取导航期间，submitting 的状态（请求进行中的状态）
export const useNavSubmitting = (method: Method, pathname?: string) => {
  const navigation = useNavigation();
  const location = useLocation();

  const submitting =
    navigation.state === 'submitting' &&
    navigation.formMethod.toUpperCase() === method &&
    navigation.formAction === (pathname || location.pathname);

  return submitting;
};
