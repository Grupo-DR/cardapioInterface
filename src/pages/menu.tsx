import { Button } from "@/components/ui/button";
import { getTodayMenu, updateMenu } from "@/lib/api/supabaseApi";
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

export const Menu = () => {
  const [menu, setMenu] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  async function fetchData() {
    const data = await getTodayMenu();
    setMenu(data);
  }

  function handleEdit(m: any) {
    setSelectedMenu(m);
    setOpenEdit(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cardápio atual</h1>

      {menu && (
        <div
          key={menu.id}
          className="my-2 p-2 bg-slate-200 rounded items-center flex justify-between"
        >
          <div>
            <p>Data: {format(parseISO(menu.data), "dd/MM/yyyy")}</p>
            <p>Primeira opção: {menu.primeira}</p>
            <p>Segunda opção: {menu.segunda}</p>
            <p>Guarnição: {menu.guarnicao}</p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="size-8"
            onClick={() => handleEdit(menu)}
          >
            <DotsThreeVerticalIcon weight="bold" />
          </Button>
        </div>
      )}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cardápio</DialogTitle>
            <DialogDescription>
              Atualize as informações do cardápio selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedMenu && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="primeira">Primeira opção</Label>
                <Input
                  id="primeira"
                  value={selectedMenu.primeira}
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
                  value={selectedMenu.segunda}
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
                  value={selectedMenu.guarnicao}
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
                    setMenu(atualizado[0]);
                  }
                  setOpenEdit(false);
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
