import { Button } from "@/components/ui/button";
import { getWeekMenus, updateMenu } from "@/lib/api/supabaseApi";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Menu = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  async function fetchData() {
    const data = await getWeekMenus();
    setMenus(data);
  }

  function handleEdit(m: any) {
    setSelectedMenu({ ...m });
    setOpenEdit(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getDayName = (dateString: string) => {
    const date = parseISO(dateString);
    const dayNames = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return dayNames[date.getDay()];
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cardápios da Semana Atual</h1>

      {menus.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum cardápio encontrado para esta semana.
        </p>
      ) : (
        <div className="space-y-4">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="p-4 bg-slate-200 rounded-lg items-center flex justify-between shadow-sm"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {getDayName(menu.data)} - {format(parseISO(menu.data), "dd/MM/yyyy")}
                </p>
                <div className="mt-2 space-y-1">
                  <p>
                    <span className="font-medium">Primeira opção:</span>{" "}
                    {menu.primeira || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Segunda opção:</span>{" "}
                    {menu.segunda || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Guarnição:</span>{" "}
                    {menu.guarnicao || "-"}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 ml-4"
                onClick={() => handleEdit(menu)}
              >
                <DotsThreeVerticalIcon weight="bold" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cardápio</DialogTitle>
            <DialogDescription>
              {selectedMenu &&
                `Atualize as informações do cardápio de ${getDayName(selectedMenu.data)} - ${format(parseISO(selectedMenu.data), "dd/MM/yyyy")}.`}
            </DialogDescription>
          </DialogHeader>
          {selectedMenu && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="primeira">Primeira opção</Label>
                <Input
                  id="primeira"
                  value={selectedMenu.primeira || ""}
                  onChange={(e) =>
                    setSelectedMenu({
                      ...selectedMenu,
                      primeira: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="segunda">Segunda opção</Label>
                <Input
                  id="segunda"
                  value={selectedMenu.segunda || ""}
                  onChange={(e) =>
                    setSelectedMenu({
                      ...selectedMenu,
                      segunda: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="guarnicao">Guarnição</Label>
                <Input
                  id="guarnicao"
                  value={selectedMenu.guarnicao || ""}
                  onChange={(e) =>
                    setSelectedMenu({
                      ...selectedMenu,
                      guarnicao: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={async () => {
                  if (!selectedMenu) return;
                  const atualizado = await updateMenu(selectedMenu.id, {
                    primeira: selectedMenu.primeira,
                    segunda: selectedMenu.segunda,
                    guarnicao: selectedMenu.guarnicao,
                  });
                  if (atualizado && atualizado.length > 0) {
                    setMenus((prev) =>
                      prev.map((m) =>
                        m.id === atualizado[0].id ? atualizado[0] : m
                      )
                    );
                    toast.success("Cardápio atualizado com sucesso!");
                    setOpenEdit(false);
                  } else {
                    toast.error("Erro ao atualizar cardápio.");
                  }
                }}
              >
                Salvar
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
