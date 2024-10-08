import {closeDialog, useDialogStore} from '@ui/overlays/store/dialog-store';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import React from 'react';

export function DialogStoreOutlet() {
  const {dialog: DialogElement, data} = useDialogStore();
  return (
    <DialogTrigger
      type="modal"
      isOpen={DialogElement != null}
      onClose={value => {
        closeDialog(value);
      }}
    >
      {DialogElement ? <DialogElement {...data} /> : null}
    </DialogTrigger>
  );
}
