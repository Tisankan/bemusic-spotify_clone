import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {useForm} from 'react-hook-form';
import {Trans} from '@ui/i18n/trans';
import {Button} from '@ui/buttons/button';
import {CrupdateGenreFrom} from '@app/admin/genres-datatable-page/crupdate-genre-form';
import {
  CreateGenrePayload,
  useCreateGenre,
} from '@app/admin/genres-datatable-page/requests/use-create-genre';

export function CreateGenreDialog() {
  const {close, formId} = useDialogContext();
  const form = useForm<CreateGenrePayload>();
  const createGenre = useCreateGenre(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Create new genre" />
      </DialogHeader>
      <DialogBody>
        <CrupdateGenreFrom
          formId={formId}
          form={form as any}
          onSubmit={values => {
            createGenre.mutate(values, {
              onSuccess: () => close(),
            });
          }}
        />
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          form={formId}
          disabled={createGenre.isPending}
          variant="flat"
          color="primary"
          type="submit"
        >
          <Trans message="Create" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
