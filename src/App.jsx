import { useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState({ file: null, path: "" });
  const [label, setLabel] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const onChange = (e) => {
    const path = e.target.value;
    const file = e.target.files[0];

    setValue((state) => ({ ...state, path, file }));
  };

  const getPrediction = async (file) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://hf.space/embed/akuokojnr/apples-oranges/+/api/predict",
        {
          method: "POST",
          body: JSON.stringify({ data: [file] }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();
      setLabel(result.data[0].label);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const submit = () => {
    let reader = new FileReader();
    reader.readAsDataURL(value.file);

    reader.onload = () => getPrediction(reader.result);

    reader.onerror = (error) => {
      console.log(error);
    };
  };

  const isButtonEnabled = value.file || !isLoading ? false : true;

  return (
    <div className="App">
      <h1>
        {label ? (
          <>
            It's an <span style={{ textTransform: "capitalize" }}>{label}</span>
            !
          </>
        ) : (
          <>Apples or Orange?</>
        )}
      </h1>
      <div className="card">
        <input
          type="file"
          name="image"
          value={value.path}
          onChange={onChange}
        />
        <button onClick={submit} disabled={isButtonEnabled}>
          {isLoading ? <>Loading...</> : <>Classify image</>}
        </button>
      </div>
      <p className="read-the-docs">
        Note: This app only classifies apples and oranges but nothing else.
        Hence, if you upload an image of, say, a dog, the app will try to
        categorize it as an apple or orange.
      </p>
    </div>
  );
}

export default App;
