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
  DespesaAgrupada,
  DespesaPorTipo,
  getDespesas,
  agruparDespesasPorMes,
  agruparDespesasPorTipo,
} from "@/services/api";

interface DespesasDashboardProps {
  deputadoId: number;
}

export function DespesasDashboard({ deputadoId }: DespesasDashboardProps) {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressoCarregamento, setProgressoCarregamento] = useState(0);

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
      <div className="text-center py-8">
        <div className="mb-4">Carregando dados...</div>
        <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressoCarregamento}%` }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const meses = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  const formatMes = (mes: number) => meses[mes - 1];

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

      {/* Total de Despesas */}
      <Card className="p-6">
        <Title>Total de Despesas</Title>
        <div className="mt-4">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(totalDespesas)}
          </span>
        </div>
      </Card>

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
                <div className="p-2 bg-white shadow-lg rounded-lg border">
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
    </div>
  );
}
