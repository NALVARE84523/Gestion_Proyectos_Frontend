import { useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";
import axios from "axios";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || email.length < 6) {
      setAlerta({
        msg: "El email es obligatorio",
        error: true,
      });
      return;
    }
    try {
      const { data } = await clienteAxios.post(
        `/usuarios/olvide-password`,
        { email }
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  let isAdBlockEnabled = undefined;

  const checkIsAdBlockEnabled = () => {
    // con esto evitamos que se vuelva a manipular el DOM
    // si ya sabemos si el resultado de la ejecución anterior
    if (typeof isAdBlockEnabled !== "undefined")
      return Promise.resolve(isAdBlockEnabled);

    const ad = document.createElement("div");
    ad.innerHTML = "&nbsp;";
    ad.className = "adsbox";
    document.body.appendChild(ad);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        // si el elemento no tiene altura, es que
        // el AdBlocker se lo ha cargado
        isAdBlockEnabled = ad.offsetHeight === 0;
        // eliminamos el "falso" anuncio
        ad.remove();
        resolve(isAdBlockEnabled);
      }, 100);
    });
  };

  // ya lo podrías usar en cualquier parte de tu código así
  checkIsAdBlockEnabled().then((isAdBlockEnabled) => {
    console.log(isAdBlockEnabled);
  });

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu acceso y no pierdas tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Enviar instrucciones"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Ya tienes una cuenta? Inicia sesion
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar"
        >
          No tienes una cuenta? Registrate
        </Link>
      </nav>
    </>
  );
};

export default OlvidePassword;