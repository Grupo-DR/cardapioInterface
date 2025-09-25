"use client";

import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // se usar sonner; senão use alert()
import supabase from "@/lib/supabase";
import { getCombinedMenu, getTodayMenu } from "@/lib/api/supabaseApi";

type Menu = {
  id: number;
  data: string;
  guarnicao?: string;
  options: string[];
};

export default function VisitForm() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [nome, setNome] = useState("");
  const [cc, setCc] = useState("");
  const [escolha, setEscolha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      const data = await getCombinedMenu();
      const todayMenu = await getTodayMenu();
      if (data) setMenu({ ...data, data: todayMenu.data, id: todayMenu.id });
    }

    fetchMenu();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!menu) {
      toast.error("Não há cardápio para hoje.");
      return;
    }
    if (!nome.trim() || !cc.trim() || !escolha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        data_envio: new Date().toISOString(),
        data_menu: menu.data,
        menu_id: menu.id,
        escolha,
        nome_convidado: nome.trim(),
        cc_convidado: cc.trim(),
        user_id: null,
        numero: null,
      };

      const { data: insertData, error } = await supabase
        .from("respostas")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.log(insertData);
        console.error("Erro insert respostas:", error);
        toast.error("Erro ao salvar escolha.");
      } else {
        toast.success("Escolha registrada com sucesso!");
        // limpa form
        setNome("");
        setCc("");
        setEscolha("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      {menu ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Cardápio do Dia
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="font-medium">Guarnição:</p>
              <p className="text-muted-foreground">{menu.guarnicao}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Nome do convidado</label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo do visitante"
                />
              </div>

              <div>
                <label className="font-medium">Centro de Custo</label>
                <Input
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Ex.: 12345"
                />
              </div>

              <div>
                <label className="font-medium">Escolha do cardápio</label>
                <Select onValueChange={(v) => setEscolha(v)} value={escolha}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {menu.options.map((opt, i) => (
                      <SelectItem key={i} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Confirmar escolha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p>Nenhum cardápio encontrado para hoje.</p>
        </div>
      )}
    </div>
  );
}
