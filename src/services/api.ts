interface Gabinete {
  nome: string;
  predio: string;
  sala: string;
  andar: string | null;
  telefone: string;
  email: string | null;
}

interface UltimoStatus {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string | null;
  nomeEleitoral: string;
  gabinete: Gabinete;
  situacao: string;
  condicaoEleitoral: string;
}

interface DeputadoResponse {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

export interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

export interface DeputadoDetalhado {
  id: number;
  nomeCivil: string;
  ultimoStatus: UltimoStatus;
  dataNascimento: string;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string | null;
  redeSocial: string[];
}

export interface Despesa {
  ano: number;
  mes: number;
  tipoDespesa: string;
  codDocumento: number;
  tipoDocumento: string;
  codTipoDocumento: number;
  dataDocumento: string;
  numDocumento: string;
  valorDocumento: number;
  urlDocumento: string;
  nomeFornecedor: string;
  cnpjCpfFornecedor: string;
  valorLiquido: number;
  valorGlosa: number;
  numRessarcimento: string;
  codLote: number;
  parcela: number;
}

export interface DespesaAgrupada {
  mes: number;
  total: number;
}

export interface DespesaPorTipo {
  tipoDespesa: string;
  total: number;
}

export async function searchDeputados(nome: string): Promise<Deputado[]> {
  const response = await fetch(`/api/deputados?nome=${nome}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { dados: DeputadoResponse[] };

  if (!data.dados) {
    return [];
  }

  return data.dados.map((dep) => ({
    id: dep.id,
    nome: dep.nome,
    siglaPartido: dep.siglaPartido,
    siglaUf: dep.siglaUf,
    urlFoto: dep.urlFoto,
  }));
}

export async function getDeputado(id: number): Promise<DeputadoDetalhado> {
  const response = await fetch(`/api/deputados/${id}`);
  const data = await response.json();
  return data.dados;
}

export async function getDespesas(id: number, ano: number): Promise<Despesa[]> {
  const anoAtual = new Date().getFullYear();
  const mesAtual = ano === anoAtual ? new Date().getMonth() + 1 : 12;

  const promises = Array.from({ length: mesAtual }, (_, index) => {
    const mes = index + 1;
    return fetch(`/api/deputados/${id}/despesas?ano=${ano}&mes=${mes}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }
    );
  });

  const results = await Promise.allSettled(promises);
  const todasDespesas: Despesa[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value.dados) {
      todasDespesas.push(...result.value.dados);
    }
  });

  return todasDespesas;
}

export function agruparDespesasPorMes(
  despesas: Despesa[],
  ano: number
): DespesaAgrupada[] {
  const despesasPorMes = despesas.reduce(
    (acc: { [key: number]: number }, despesa) => {
      const mes = despesa.mes;
      acc[mes] = (acc[mes] || 0) + despesa.valorLiquido;
      return acc;
    },
    {}
  );

  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const totalMeses = ano < anoAtual ? 12 : mesAtual;

  return Array.from({ length: totalMeses }, (_, i) => i + 1).map((mes) => ({
    mes,
    total: despesasPorMes[mes] || 0,
  }));
}

export function agruparDespesasPorTipo(despesas: Despesa[]): DespesaPorTipo[] {
  const despesasPorTipo = despesas.reduce(
    (acc: { [key: string]: number }, despesa) => {
      const tipo = despesa.tipoDespesa;
      acc[tipo] = (acc[tipo] || 0) + despesa.valorLiquido;
      return acc;
    },
    {}
  );

  return Object.entries(despesasPorTipo)
    .map(([tipoDespesa, total]) => ({
      tipoDespesa,
      total,
    }))
    .sort((a, b) => b.total - a.total);
}
