import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { setMenu } from "@/lib/api/supabaseApi";
import supabase from "@/lib/supabase";

const weekDays = ["segunda", "terca", "quarta", "quinta", "sexta"] as const;

const daySchema = z.object({
  primeira: z.string().optional(),
  segunda: z.string().optional(),
  guarnicao: z.string().optional(),
});

const formSchema = z
  .object({
    segunda: daySchema,
    terca: daySchema,
    quarta: daySchema,
    quinta: daySchema,
    sexta: daySchema,
  })
  .refine(
    (data) => {
      return Object.values(data).some((day) =>
        Object.values(day).some((value) => value && value.trim() !== ""),
      );
    },
    {
      message: "Preencha pelo menos um campo em algum dia da semana",
      path: ["root"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export default function HomePage() {
  const [startDate, setStartDate] = useState<Date>(new Date());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segunda: { primeira: "", segunda: "", guarnicao: "" },
      terca: { primeira: "", segunda: "", guarnicao: "" },
      quarta: { primeira: "", segunda: "", guarnicao: "" },
      quinta: { primeira: "", segunda: "", guarnicao: "" },
      sexta: { primeira: "", segunda: "", guarnicao: "" },
    },
  });
  const selectedWeekDates = Array.from({ length: 5 }, (_, i) =>
    format(
      addDays(startOfWeek(startDate, { weekStartsOn: 1 }), i),
      "yyyy-MM-dd",
    ),
  );

  async function exportRespostasToExcel() {
    try {
      // Ajuste o filtro conforme necessário (ex.: respostas do dia)
      const hoje = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("respostas")
        .select(
          `
        *,
        funcionarios ( nome, cc )
      `,
        )
        .eq("data_menu", hoje);

      if (error) {
        console.error(error);
        toast.error("Erro ao buscar respostas.");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Nenhum dado encontrado");
        return;
      }

      const sheetData = [
        ["Nome", "Centro de Custo", "Escolha"],
        ...data.map((item: any) => [
          // nome: prioriza convidado > funcionario
          item.nome_convidado || item.funcionarios?.nome || "",
          // cc: prioriza cc_convidado > funcionario cc
          item.cc_convidado || item.funcionarios?.cc || "",
          // escolha
          item.escolha || "",
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Respostas");

      XLSX.writeFile(wb, `respostas_${hoje}.xlsx`);

      toast.success("Planilha gerada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar planilha");
    }
  }

  async function onSubmit(values: FormValues) {
    const payload = weekDays
      .map((dia, index) => {
        const diaValores = values[dia] ?? {};
        const temPreenchido = Object.values(diaValores).some(
          (v) => v && v.trim() !== "",
        );
        if (!temPreenchido) return null;
        return {
          data: selectedWeekDates[index],
          ...diaValores,
        };
      })
      .filter(Boolean);

    if (payload.length === 0) {
      return toast.error("Necessário preencher pelo menos um dia da semana.");
    }

    try {
      await setMenu(payload);
      toast.success("Cardápio enviado com sucesso!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar o cardápio. Tente novamente.");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Cadastro do Cardápio da Semana
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6">
            <FormLabel className="mb-2 block">
              Escolha uma data da semana
            </FormLabel>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              weekStartsOn={1}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weekDays.map((dia, index) => (
              <div key={dia} className="border p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg capitalize mb-2">
                  {dia === "terca" ? "terça" : dia} ({selectedWeekDates[index]})
                </h3>
                {(["primeira", "segunda", "guarnicao"] as const).map(
                  (campo) => (
                    <FormField
                      key={campo}
                      control={form.control}
                      name={`${dia}.${campo}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{campo}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Digite ${campo}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ),
                )}
              </div>
            ))}
          </div>

          {form.formState.errors.root && (
            <p className="text-red-500">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="mt-4">
            Enviar Cardápio
          </Button>
        </form>
      </Form>
      <Button
        onClick={() => exportRespostasToExcel()}
        type="button"
        variant="outline"
        className="mt-4"
      >
        Trazer respostas do dia
      </Button>
    </div>
  );
}
