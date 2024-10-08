import {FormSelect, OptionGroup, SelectProps} from '@ui/forms/select/select';
import {message} from '@ui/i18n/message';
import {Option} from '@ui/forms/combobox/combobox';
import {useTrans} from '@ui/i18n/use-trans';
import {Timezone} from '@common/http/value-lists';
import {InputSize} from '@ui/forms/input-field/input-size';
import {ReactNode} from 'react';

interface Props extends Omit<SelectProps<any>, 'selectionMode' | 'children'> {
  name: string;
  timezones: Record<string, Timezone[]>;
  size?: InputSize;
  label?: ReactNode;
}
export function TimezoneSelect({
  name,
  size,
  timezones,
  label,
  ...selectProps
}: Props) {
  const {trans} = useTrans();
  return (
    <FormSelect
      selectionMode="single"
      name={name}
      size={size}
      label={label}
      showSearchField
      searchPlaceholder={trans(message('Search timezones'))}
      {...selectProps}
    >
      {Object.entries(timezones).map(([sectionName, sectionItems]) => (
        <OptionGroup label={sectionName} key={sectionName}>
          {sectionItems.map(timezone => (
            <Option key={timezone.value} value={timezone.value}>
              {timezone.text}
            </Option>
          ))}
        </OptionGroup>
      ))}
    </FormSelect>
  );
}
