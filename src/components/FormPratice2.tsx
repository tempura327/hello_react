import { useForm } from "react-hook-form";


import TextField from "@mui/material/TextField";
import Button from "@mui/material//Button";
import Typography from "@mui/material//Typography";

interface PersonData {
  name: string;
  age: number | null;
  phone: string;
}

const DirtyFieldMarker = ({ fieldName }:{ fieldName:string }) => {
  return (
    <Typography className="text-yellow-400">
      {fieldName} is dirty field
    </Typography>
  );
};

const FormPratice2 = () => {
  const { register, watch, formState, handleSubmit, reset } = useForm<
    PersonData
  >({
    defaultValues: {
      name: "Alex",
      age: 30,
      phone: "0912345678"
    },
    // resetOptions: {
    //   keepDirty: true
    // }
  });

  const { isDirty, dirtyFields, errors } = formState;

  const [name, age, phone] = watch(["name", "age", "phone"]);

  return (
    <div>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit((data) => {
          console.log(data);
          console.log(errors);
        })}
      >
        <TextField
          className="mb-6"
          helperText={dirtyFields.name && <DirtyFieldMarker fieldName="name" />}
          label="name"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          {...register("name")}
        />

        <TextField
          className="mb-6"
          // errors要onSubmit後才會列出error的欄位
          error={!!errors.age}
          helperText={dirtyFields.age && <DirtyFieldMarker fieldName="age" />}
          label="age"
          variant="outlined"
          {...register("age", {
            max: {
              value: 100,
              message: "too old"
            }
          })}
        />

        <TextField
          className="mb-6"
          error={!!errors.phone}
          helperText={
            dirtyFields.phone && <DirtyFieldMarker fieldName="phone" />
          }
          label="phone"
          variant="outlined"
          {...register("phone", {
            pattern: /^09[0-9]{8}$/
          })}
        />

        <Button className="mb-6" type="submit" variant="contained">
          submit
        </Button>

        <div className="grid grid-cols-2 gap-4 ">
          <Button
            className="mb-6"
            type="button"
            variant="outlined"
            onClick={() => {
              reset({
                name: "",
                age: null,
                phone: ""
              });
            }}
          >
            reset
          </Button>

          <Button
            className="mb-6"
            type="button"
            variant="outlined"
            onClick={() => {
              reset(
                {
                  name: "",
                  age: null,
                  phone: ""
                },
                {
                  keepDirty: true
                }
              );
            }}
          >
            (keep dirty) reset
          </Button>
        </div>
      </form>

      <div>
        {
            watch('name') === 'Obama' && <img src="https://images.unsplash.com/photo-1580130379624-3a069adbffc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=726&q=80" />
        }

        <Typography variant="h4">Current Values</Typography>

        <Typography variant="body1">name:{name}</Typography>
        <Typography variant="body1">age:{age}</Typography>
        <Typography variant="body1">phone:{phone}</Typography>
        <Typography variant="body1">isDirty:{isDirty.toString()}</Typography>
        {/* <Typography variant="body1">errors:{JSON.stringify(errors)}</Typography> */}
      </div>
    </div>
  );
};

export default FormPratice2;