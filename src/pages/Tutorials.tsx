import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/ui/BaseModal";
import { Icon } from "@/components/ui/Icon";
import { toast } from "@/components/ui/use-toast";


const FORM_ENDPOINT_1 = "https://formsubmit.co/ajax/tayebekk2004@gmail.com";
const FORM_ENDPOINT_2 = "https://formsubmit.co/ajax/ilyesbakkar44@gmail.com";

export default function Tutorials() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDiscord, setOpenDiscord] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter a valid email", variant: "destructive" as any });
      return;
    }
    try {
      setLoading(true);
      const fd1 = new FormData();
      fd1.append("email", email);
      fd1.append("_subject", "SmartCalc+ Notify: Final Year Project (PFE)");
      fd1.append("_autoresponse", window.location.origin + "/notify-autoresponse.html");

      const fd2 = new FormData();
      fd2.append("email", email);
      fd2.append("_subject", "SmartCalc+ Notify: Final Year Project (PFE)");
      fd2.append("_autoresponse", window.location.origin + "/notify-autoresponse.html");

      const [res1, res2] = await Promise.all([
        fetch(FORM_ENDPOINT_1, { method: "POST", headers: { Accept: "application/json" }, body: fd1 }),
        fetch(FORM_ENDPOINT_2, { method: "POST", headers: { Accept: "application/json" }, body: fd2 })
      ]);

      if (res1.ok && res2.ok) {
        toast({ title: (<span className="inline-flex items-center gap-2"><Icon name="checkcircle" size={18} />Message sent successfully!</span>) });
        setOpen(false);
        setEmail("");
      } else if (res1.ok || res2.ok) {
        toast({ title: "Message sent partially - one recipient received it successfully" });
        setOpen(false);
        setEmail("");
      } else {
        toast({ title: "Oops! Something went wrong. 😅", variant: "destructive" as any });
      }
    } catch (err) {
      toast({ title: "Oops! Something went wrong. 😅", variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <header className="flex items-center gap-3">
        <Icon name="graduationcap" size={24} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Final Year Project (PFE)</h1>
      </header>
      <p className="text-sm text-muted-foreground">Coming Soon…</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setOpen(true)} className="gradient-primary text-primary-foreground hover-scale w-full sm:w-64">Notify Me When Ready</Button>
        <Button asChild variant="outline" className="hover-scale w-full sm:w-64"><Link to="/canevas" className="flex items-center gap-2"><Icon name="filetext" size={18} />View Documentation</Link></Button>
        <Button onClick={() => setOpenDiscord(true)} variant="secondary" className="hover-scale w-full sm:w-64">Join Community to Follow Progress</Button>
      </div>

      <BaseModal open={open} onOpenChange={setOpen} title="Stay tuned!" description="Enter your email to be notified when this section is ready.">
        <form onSubmit={onSubscribe} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="notify-email" className="text-sm">Email</label>
            <input
              id="notify-email"
              type="email"
              required
              className="w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground px-3 py-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground hover-scale" disabled={loading}>
              {loading ? "Sending…" : "Notify me"}
            </Button>
          </div>
        </form>
      </BaseModal>
      <BaseModal open={openDiscord} onOpenChange={setOpenDiscord} title="Stay tuned!" description="The Discord channel will open soon" />
    </main>
  );
}
