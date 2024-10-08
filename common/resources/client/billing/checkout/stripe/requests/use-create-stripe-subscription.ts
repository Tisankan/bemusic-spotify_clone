import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@ui/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {
  clientSecret: string;
}

export function useCreateStripeSubscription(productId: string | number) {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: () => createStripeSubscription(productId),
    onSuccess: () => {
      toast(trans(message('Mutation performed')));
      queryClient.invalidateQueries({queryKey: ['Query Key']});
    },
    onError: err => showHttpErrorToast(err),
  });
}

function createStripeSubscription(
  productId: string | number,
): Promise<Response> {
  return apiClient
    .post('billing/subscriptions/stripe/create', {product_id: productId})
    .then(r => r.data);
}
