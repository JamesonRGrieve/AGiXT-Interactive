import React from 'react';
import Field, { FieldProps, Message } from '../FormControl/Field';

export type FormProps = {
  fields: { [id: string]: FieldProps };
  messages: Message[];
};
// Should maintain a state object

const Form: React.FC<FormProps> = ({ fields: initialFields }) => {
  const [fields, setFields] = React.useState<{ [id: string]: FieldProps }>(initialFields);

  const handleChange = (id: string, value: string) => {
    const updatedFields = {
      ...fields,
      [id]: {
        ...fields[id],
        value,
      },
    };
    setFields(updatedFields);
  };

  return (
    <form>
      {Object.entries(fields).map(([id, fieldProps]) => (
        <Field
          key={id}
          {...fieldProps}
          nameID={id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(id, e.target.value)}
        />
      ))}
    </form>
  );
};
export default Form;
