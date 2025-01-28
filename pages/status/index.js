import useSWR from "swr";
import { useEffect, useState } from "react";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const data = useSWR("/api/v1/status", fetchAPI);

  return (
    <>
      <StatusCard data={data} />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    const updatedAt = new Date(data.updated_at);
    updatedAtText = updatedAt.toLocaleString("pt-BR");
  }

  return <small>Última atualização: {updatedAtText}</small>;
}

import { CiSquareCheck } from "react-icons/ci";

function StatusCard({ data }) {
  const dependencies = data?.data?.dependencies || {};
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin.split("//")[1]);
  }, []);

  return (
    <div className="flex flex-row h-screen ">
      <div className="container mx-auto max-w-2xl self-center space-y-10">
        <h1 className="text-4xl font-bold">Atual status de {url} </h1>
        <div className="border-[0.0125rem] border-zinc-400 rounded divide divide-gray-400  bg-zinc-200">
          {Object.entries(dependencies).map(([key, value]) => (
            <div
              key={key}
              className="w-full rounded p-12 bg-gray-100 shadow group
          transition-all duration-300 ease-in-out hover:bg-gray-white" // Transição de cor de fundo
            >
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-base font-semibold">
                  {key.at(0).toUpperCase() + key.slice(1)}
                </h2>
                <CiSquareCheck size={24} className="text-green-500" />
              </div>
              <div className="mt-2 space-y-1 overflow-hidden max-h-0 group-hover:max-h-96 transition-all duration-500 ease-in-out">
                {Object.entries(value).map(([propKey, propValue]) => (
                  <div key={propKey} className="flex justify-between">
                    <p className="text-sm text-gray-700">
                      {propKey.at(0).toUpperCase() +
                        propKey.slice(1).replace(/_/g, " ")}
                      :
                    </p>
                    <span className="text-sm font-medium text-gray-900">
                      {String(propValue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <UpdatedAt />
      </div>
    </div>
  );
}
