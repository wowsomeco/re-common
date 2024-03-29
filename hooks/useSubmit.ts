import {
  NotifContent,
  useNotifProvider
} from '~w-common/contexts/notifContext';
import { Resp, useFetch } from '~w-common/hooks';
import { removeEmpty } from '~w-common/scripts';
import Observable from '~w-common/scripts/observable';

import { HttpContentType } from './useHttp';

export type OnSubmitProps<T> = {
  doSubmit: (model: T) => Promise<void>;
  loading: boolean;
};

export type OnSubmitted<T> = ((resp: Resp<T>) => void) | undefined;

export interface SubmitOptions<T> {
  /** `true`: POST, `false`: PUT */
  isNew: boolean;
  /** The API endpoint */
  endpoint: string;
  /** if it's true, it will omit the empty fields out of the model */
  whitelist: boolean;
  /** `optional` callback returning the [[Resp]] data that is triggered once submitted */
  onSubmitted?: OnSubmitted<T>;
  /** object that will get merged to the submitted data prior to submitting */
  extraPayload?: Record<string, any>;
  /** callback of values in the payload that you want to omit by returning true for each of them */
  omit?: ((v: any) => boolean)[];
  contentType?: HttpContentType;
  handleNotif?: (
    notif: Observable<NotifContent | undefined>,
    response: Resp<any>,
    isNew: boolean
  ) => void;
}

/**
 * Handles submitting logic to the backend
 * @see [[SubmitOptions]]
 */
const useSubmit = <T>(options: SubmitOptions<T>): OnSubmitProps<T> => {
  const {
    isNew,
    endpoint,
    whitelist,
    onSubmitted,
    extraPayload = {},
    omit,
    contentType = 'application/json',
    handleNotif
  } = options;
  const { notif } = useNotifProvider();
  const { submit, loading } = useFetch<T>({
    method: isNew ? 'POST' : 'PUT',
    endpoint,
    contentType
  });

  const doSubmit = async (model: T) => {
    const payload = Object.assign(
      extraPayload,
      whitelist ? removeEmpty(model, omit) : model
    );

    const r = await submit({ body: payload });

    handleNotif?.(notif, r, isNew);
    onSubmitted?.(r);
  };

  return { doSubmit, loading };
};

export default useSubmit;
