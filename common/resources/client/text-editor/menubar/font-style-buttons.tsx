import React from 'react';
import clsx from 'clsx';
import {IconButton} from '@ui/buttons/icon-button';
import {FormatBoldIcon} from '@ui/icons/material/FormatBold';
import {FormatItalicIcon} from '@ui/icons/material/FormatItalic';
import {FormatUnderlinedIcon} from '@ui/icons/material/FormatUnderlined';
import {MenubarButtonProps} from './menubar-button-props';
import {Tooltip} from '@ui/tooltip/tooltip';
import {Trans} from '@ui/i18n/trans';

export function FontStyleButtons({editor, size}: MenubarButtonProps) {
  return (
    <span className={clsx('flex-shrink-0 whitespace-nowrap')}>
      <Tooltip label={<Trans message="Bold" />}>
        <IconButton
          size={size}
          color={editor.isActive('bold') ? 'primary' : null}
          onClick={() => {
            editor.commands.focus();
            editor.commands.toggleBold();
          }}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip label={<Trans message="Italic" />}>
        <IconButton
          size={size}
          color={editor.isActive('italic') ? 'primary' : null}
          onClick={() => {
            editor.commands.focus();
            editor.commands.toggleItalic();
          }}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip label={<Trans message="Underline" />}>
        <IconButton
          size={size}
          color={editor.isActive('underline') ? 'primary' : null}
          onClick={() => {
            editor.commands.focus();
            editor.commands.toggleUnderline();
          }}
        >
          <FormatUnderlinedIcon />
        </IconButton>
      </Tooltip>
    </span>
  );
}
