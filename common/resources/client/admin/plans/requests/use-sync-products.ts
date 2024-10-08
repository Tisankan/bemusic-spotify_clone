import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {useTrans} from '@ui/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useSyncProducts() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: () => syncPlans(),
    onSuccess: () => {
      toast(trans(message('Plans synced')));
    },
    onError: err => showHttpErrorToast(err, message('Could not sync plans')),
  });
}

function syncPlans(): Promise<Response> {
  return apiClient.post('billing/products/sync').then(r => r.data);
}
