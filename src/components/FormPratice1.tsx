import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material//Button";

import '../style/index.css';

interface PersonData {
  name: string;
  age: number;
  phone: string;
}

const Form = () => {
  const { register, handleSubmit, getValues, setValue } = useForm<PersonData>();
  const { onChange, onBlur, name, ref } = register("name");

  const sendData:SubmitHandler<PersonData> = (data) => console.log(data);
  const validateFailed:SubmitErrorHandler<PersonData> = (message) => console.warn(message);

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(sendData, validateFailed)}
    >
      <TextField
        className="mb-6"
        label="姓名"
        variant="outlined"
        onChange={onChange} // 訂閱input change事件
        onBlur={onBlur} // 訂閱input blur事件
        name={name} // 欄位名
        ref={ref} // 用來註冊name的ref
      />

      <TextField
        className="mb-6"
        label="年齡"
        variant="outlined"
        {...register("age", {
          max: {
            value: 100,
            message: "太老"
          }
        })}
      />

      <TextField
        className="mb-6"
        label="電話"
        variant="outlined"
        {...register("phone", {
          pattern: /^09[0-9]{8}$/
        })}
      />

      <Button className="mb-6" type="submit" variant="contained">
        Search
      </Button>

      <Button
        className="mb-6"
        type="button"
        variant="outlined"
        onClick={() => {
          console.log(getValues(["name", "age"]));
        }}
      >
        get values
      </Button>

      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          setValue("name", "Tempura Ninja");
        }}
      >
        set name
      </Button>
    </form>
  );
};

export default Form;
