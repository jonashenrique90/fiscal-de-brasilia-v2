"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Title,
  BarChart,
  DonutChart,
  type CustomTooltipProps,
} from "@tremor/react";
import {
  Despesa,
  getDespesas,
  agruparDespesasPorMes,
  agruparDespesasPorTipo,
} from "@/services/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { HiChevronDown } from "react-icons/hi";
import { formatCurrency, formatMes } from "@/utils/format";

interface DespesasDashboardProps {
  deputadoId: number;
}

export function DespesasDashboard({ deputadoId }: DespesasDashboardProps) {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressoCarregamento, setProgressoCarregamento] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function loadDespesas() {
      try {
        setLoading(true);
        setError("");
        setDespesas([]);
        setProgressoCarregamento(0);

        const data = await getDespesas(deputadoId, ano);
        setDespesas(data);
      } catch {
        setError("Erro ao carregar despesas");
        setDespesas([]);
      } finally {
        setLoading(false);
        setProgressoCarregamento(100);
      }
    }

    loadDespesas();
  }, [deputadoId, ano]);

  const despesasPorMes = agruparDespesasPorMes(despesas, ano);
  const despesasPorTipo = agruparDespesasPorTipo(despesas);
  const totalDespesas = despesas.reduce(
    (acc, despesa) => acc + despesa.valorLiquido,
    0
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton para Seletor de Ano */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-8 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </Card>

        {/* Container para os cards de valores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Skeleton para Total de Despesas */}
          <Card className="p-6 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
            <div className="h-6 w-40 bg-gray-200/50 rounded mb-4"></div>
            <div className="h-10 w-48 bg-gray-200/50 rounded"></div>
          </Card>

          {/* Skeleton para Média Mensal */}
          <Card className="p-6 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
            <div className="h-6 w-40 bg-gray-200/50 rounded mb-4"></div>
            <div className="h-10 w-48 bg-gray-200/50 rounded"></div>
          </Card>

          {/* Skeleton para Gasto Máximo em um Mês */}
          <Card className="p-6 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
            <div className="h-6 w-40 bg-gray-200/50 rounded mb-4"></div>
            <div className="h-10 w-48 bg-gray-200/50 rounded"></div>
          </Card>

          {/* Principal Categoria de Gasto */}
          <Card className="p-6 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
            <div className="h-6 w-40 bg-gray-200/50 rounded mb-4"></div>
            <div className="h-10 w-48 bg-gray-200/50 rounded"></div>
          </Card>
        </div>

        {/* Container para os skeletons dos gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Skeleton para Gráfico de Despesas por Mês */}
          <Card className="md:col-span-8">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
          </Card>

          {/* Skeleton para Gráfico de Despesas por Tipo */}
          <Card className="md:col-span-4">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-72 bg-gray-200 rounded-full"></div>
          </Card>
        </div>

        {/* Barra de Progresso */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-64 bg-white p-4 rounded-lg shadow-lg border border-primary/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LoadingSpinner />
            <span className="text-sm text-primary font-medium">
              Carregando dados...
            </span>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressoCarregamento}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const anoAtual = new Date().getFullYear();
  const QUANTIDADE_ANOS = 4;
  const anos = Array.from(
    { length: QUANTIDADE_ANOS },
    (_, index) => anoAtual - index
  );

  return (
    <div className="space-y-6">
      {/* Seletor de Ano */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="ano"
            className="font-medium text-tremor-default text-tremor-content-strong"
          >
            Ano:
          </label>
          <select
            id="ano"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="w-32 rounded-tremor-default border border-tremor-border bg-tremor-background 
              px-3 py-2 text-tremor-default text-tremor-content-strong outline-none 
              hover:bg-tremor-background-muted focus:border-tremor-brand 
              focus:ring-2 focus:ring-tremor-brand-muted"
          >
            {anos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Container para os cards de valores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total de Despesas */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
          <Title className="text-gray-800 text-sm">Total de Despesas</Title>
          <div className="mt-2 group relative">
            <span className="text-2xl font-bold text-primary cursor-help">
              {formatCurrency(totalDespesas)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
              <div>Total de todas as despesas no ano</div>
              <div className="font-semibold mt-1">
                {formatCurrency(totalDespesas)}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </Card>

        {/* Média Mensal */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
          <Title className="text-gray-800 text-sm">Média Mensal</Title>
          <div className="mt-2 group relative">
            <span className="text-2xl font-bold text-primary cursor-help">
              {formatCurrency(totalDespesas / despesasPorMes.length)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
              <div>Média de gastos por mês</div>
              <div className="font-semibold mt-1">
                {formatCurrency(totalDespesas / despesasPorMes.length)}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </Card>

        {/* Gasto Máximo em um Mês */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
          <Title className="text-gray-800 text-sm">Gasto Máximo Mês</Title>
          <div className="mt-2 group relative">
            <span className="text-2xl font-bold text-primary cursor-help">
              {formatCurrency(Math.max(...despesasPorMes.map((d) => d.total)))}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
              <div>Maior valor gasto em um único mês</div>
              <div className="font-semibold mt-1">
                {formatCurrency(
                  Math.max(...despesasPorMes.map((d) => d.total))
                )}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </Card>

        {/* Principal Categoria de Gasto */}
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-teal-500/20 border-none">
          <Title className="text-gray-800 text-sm">Principal Categoria</Title>
          <div className="mt-2 group relative">
            <div className="text-lg font-semibold text-primary line-clamp-2 cursor-help">
              {despesasPorTipo[0]?.tipoDespesa || "Sem despesas"}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
              <div>Categoria com maior valor total de despesas</div>
              <div className="font-semibold mt-1">
                {despesasPorTipo[0]?.tipoDespesa || "Sem despesas"}
                {despesasPorTipo[0] &&
                  ` - ${formatCurrency(despesasPorTipo[0].total)}`}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Container para os gráficos inline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Gráfico de Despesas por Mês */}
        <Card className="md:col-span-8">
          <Title>Despesas por Mês</Title>
          <BarChart
            className="mt-6 h-72"
            data={despesasPorMes.map((d) => ({
              ...d,
              mes: formatMes(d.mes),
            }))}
            index="mes"
            categories={["total"]}
            colors={["blue"]}
            valueFormatter={formatCurrency}
            customTooltip={(props: CustomTooltipProps) => {
              if (!props.payload?.[0]) return null;
              const mes = props.payload[0].payload.mes;
              const total = props.payload[0].value as number;
              return (
                <div className="p-2 bg-gray-800 shadow-lg rounded-lg text-white">
                  <div className="font-medium">{mes}</div>
                  <div>{formatCurrency(total)}</div>
                </div>
              );
            }}
            showLegend={false}
            enableLegendSlider={false}
            noDataText="Sem dados disponíveis"
            showXAxis={true}
            showYAxis={true}
            yAxisWidth={80}
            startEndOnly={false}
            showGridLines={true}
            showAnimation={true}
            animationDuration={800}
          />
        </Card>

        {/* Gráfico de Despesas por Tipo */}
        <Card className="md:col-span-4">
          <Title>Despesas por Tipo</Title>
          <DonutChart
            className="mt-6 h-72"
            data={despesasPorTipo}
            category="total"
            index="tipoDespesa"
            valueFormatter={formatCurrency}
            colors={["blue", "purple", "fuchsia", "pink", "orange", "amber"]}
          />
        </Card>
      </div>

      {/* Lista dos 10 últimos gastos */}
      <Card className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 focus:outline-none"
        >
          <Title>Últimos 10 Gastos</Title>
          <HiChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4">
            {despesas.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Nenhuma despesa encontrada
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {despesas
                  .sort(
                    (a, b) =>
                      new Date(b.dataDocumento).getTime() -
                      new Date(a.dataDocumento).getTime()
                  )
                  .slice(0, 10)
                  .map((despesa, index) => (
                    <div
                      key={`${despesa.codDocumento}-${index}`}
                      className="py-4 hover:bg-gray-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {new Date(
                                despesa.dataDocumento
                              ).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {despesa.tipoDespesa}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-900">
                            <span className="font-medium">Fornecedor:</span>{" "}
                            {despesa.nomeFornecedor}
                            {despesa.cnpjCpfFornecedor && (
                              <span className="text-gray-500">
                                {" "}
                                ({despesa.cnpjCpfFornecedor})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(despesa.valorLiquido)}
                          </div>
                          {despesa.urlDocumento && (
                            <a
                              href={despesa.urlDocumento}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary-dark transition-colors"
                            >
                              Ver comprovante
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
