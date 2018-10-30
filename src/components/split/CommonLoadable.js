import Loadable from 'react-loadable';
import Loading from './Loading';

export default function CommonLoadable(opts) {
  return Loadable(
    Object.assign(
      {
        loading: Loading,
        timeout: 10000
      },
      opts
    )
  );
}
