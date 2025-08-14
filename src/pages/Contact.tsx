import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/I18nProvider";
import { toast as sonner } from "sonner";

const FORM_ENDPOINT_1 = "https://formsubmit.co/ajax/tayebekk2004@gmail.com";
const FORM_ENDPOINT_2 = "https://formsubmit.co/ajax/ilyesbakkar44@gmail.com";


export default function Contact() {
  const { t } = useI18n();
  const params = new URLSearchParams(window.location.search);
  const test = params.get("test") === "1";
  const autotest = params.get("autotest") === "1";
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('No file selected');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    document.title = `${t('contact.title')} - SmartCalc+`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('contact.metaDescription'));
    if (autotest) {
      void runTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runTest = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('name', 'Test User');
      fd.append('email', 'test@example.com');
      fd.append('_subject', 'SmartCalc+ Test');
      fd.append('message', 'This is a test from SmartCalc+ UI');
      const res = await fetch(FORM_ENDPOINT_1, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });
      const data: any = await res.json().catch(() => null);
      const success = data?.success === true || data?.success === "true";
      if (success) {
        toast({ title: 'Test sent', description: 'Check inbox (FormSubmit).' });
      } else {
        const msg = data?.message || `Status ${res.status}`;
        toast({ title: 'Test failed', description: msg, variant: 'destructive' as any });
      }
    } catch (e) {
      toast({ title: 'Network error', description: String(e), variant: 'destructive' as any });
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '');
    const email = String(fd.get('email') || '');
    const subject = String(fd.get('_subject') || '');
    const message = String(fd.get('message') || '');
    if (!name || !email || !subject || !message) {
      toast({ title: t('contact.toasts.fillFields'), variant: 'destructive' as any });
      return;
    }
    try {
      setLoading(true);
      // Optional file attachment
      const attachment = fd.get('attachment');

      // Create separate FormData objects for each endpoint
      const payload1 = new FormData();
      payload1.append('name', name);
      payload1.append('email', email);
      payload1.append('_subject', subject);
      payload1.append('message', message);
      payload1.append('_autoresponse', window.location.origin + '/contact-autoresponse.html');

      const payload2 = new FormData();
      payload2.append('name', name);
      payload2.append('email', email);
      payload2.append('_subject', subject);
      payload2.append('message', message);
      payload2.append('_autoresponse', window.location.origin + '/contact-autoresponse.html');

      // Add attachment to both if present
      if (attachment instanceof File && attachment.size > 0) {
        payload1.append('attachment', attachment);
        payload2.append('attachment', attachment);
      }

      // Send to both endpoints simultaneously
      const [res1, res2] = await Promise.all([
        fetch(FORM_ENDPOINT_1, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: payload1
        }),
        fetch(FORM_ENDPOINT_2, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: payload2
        })
      ]);

      const [data1, data2] = await Promise.all([
        res1.json().catch(() => null),
        res2.json().catch(() => null)
      ]);

      const success1 = data1?.success === true || data1?.success === "true";
      const success2 = data2?.success === true || data2?.success === "true";

      if (success1 && success2) {
        sonner(
          <span className="inline-flex items-center gap-2"><Icon name="checkcircle" size={18} />{t('contact.toasts.success')}</span>
        );
        form.reset();
        setFileName('No file selected');
      } else if (success1 || success2) {
        sonner(
          <span className="inline-flex items-center gap-2"><Icon name="checkcircle" size={18} />Message sent partially</span>,
          { description: "One recipient received the message successfully" }
        );
        form.reset();
        setFileName('No file selected');
      } else {
        const msg1 = data1?.message || `Status ${res1.status}`;
        const msg2 = data2?.message || `Status ${res2.status}`;
        sonner(
          <span className="inline-flex items-center gap-2"><Icon name="alerttriangle" size={18} />{t('contact.toasts.error')}</span>,
          { description: `Endpoint 1: ${msg1}, Endpoint 2: ${msg2}` }
        );
      }
    } catch (e) {
      sonner(
        <span className="inline-flex items-center gap-2"><Icon name="alerttriangle" size={18} />{t('contact.toasts.error')}</span>,
        { description: String(e) }
      );
    } finally {
      setLoading(false);
    }
  };

  const testControls = useMemo(() => (
    test && (
      <div className="flex items-center gap-2">
        <Button disabled={loading} onClick={runTest}>{loading ? t('states.sending') : t('contact.sendTestEmail')}</Button>
        {autotest && <span className="text-xs text-muted-foreground">{t('contact.autotestActive')}</span>}
      </div>
    )
  ), [test, autotest, loading]);

  return (
    <main className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Icon name="phone" size={24} />
        {t('contact.title')}
      </h1>
      
      <section aria-labelledby="contacts" className="mb-6">
        <h2 id="contacts" className="text-lg font-semibold mb-3">{t('contact.getInTouch')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Badge variant="secondary" className="absolute -top-2 left-2 pointer-events-none">Mail 1</Badge>
            <a href="mailto:tayebekk2004@gmail.com" className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
              <Icon name="mail" size={20} />
              <span className="text-sm">tayebekk2004@gmail.com</span>
            </a>
          </div>
          <div className="relative">
            <Badge variant="secondary" className="absolute -top-2 left-2 pointer-events-none">Mail 2</Badge>
            <a href="mailto:ilyesbakkar44@gmail.com" className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
              <Icon name="mail" size={20} />
              <span className="text-sm">ilyesbakkar44@gmail.com</span>
            </a>
          </div>
          <div className="relative">
            <Badge variant="secondary" className="absolute -top-2 left-2 pointer-events-none">LinkedIn 1</Badge>
            <a href="https://linkedin.com/in/tayebbekkouche" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
              <Icon name="linkedin" size={20} />
              <span className="text-sm">linkedin.com/in/tayebbekkouche</span>
            </a>
          </div>
          <div className="relative">
            <Badge variant="secondary" className="absolute -top-2 left-2 pointer-events-none">LinkedIn 2</Badge>
            <a href="https://www.linkedin.com/in/ilyes-bkr-7a3ba6304" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 transition-colors">
              <Icon name="linkedin" size={20} />
              <span className="text-sm">linkedin.com/in/ilyes-bkr-7a3ba6304</span>
            </a>
          </div>
        </div>
      </section>

      <form
        ref={formRef}
        className="max-w-2xl space-y-4"
        aria-label="Contact form"
        onSubmit={handleSubmit}
      >
        
        <input type="hidden" name="_captcha" value="false" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm" htmlFor="name">{t('contact.name')}</label>
            <Input id="name" name="name" required placeholder={t('contact.placeholders.name')} />
          </div>
          <div className="space-y-1">
            <label className="text-sm" htmlFor="email">{t('contact.email')}</label>
            <Input id="email" name="email" type="email" required placeholder={t('contact.placeholders.email')} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="subject">{t('contact.subject')}</label>
          <Input id="subject" name="_subject" required placeholder={t('contact.placeholders.subject')} />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="message">{t('contact.message')}</label>
          <Textarea id="message" name="message" rows={6} required placeholder={t('contact.placeholders.message')} />
        </div>
        <div className="space-y-1">
          <label className="text-sm" htmlFor="attachment">Attachment (optional)</label>
          <Input
            ref={fileInputRef}
            id="attachment"
            name="attachment"
            type="file"
            className="sr-only"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              setFileName(f ? f.name : 'No file selected');
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Choose file"
              title="Choose file"
            >
              Choose file
            </Button>
            <span className="text-sm text-muted-foreground">{fileName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" className="gradient-primary text-primary-foreground hover-scale" disabled={loading}>
            {loading ? t('states.sending') : t('contact.send')}
          </Button>
        </div>
        {testControls}
      </form>

      <section aria-labelledby="office-info" className="max-w-3xl space-y-4">
        <h2 id="office-info" className="text-lg font-semibold">{t('contact.office.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <article className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="graduationcap" size={20} />
              <h3 className="text-sm font-semibold">{t('contact.office.universityTitle')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('contact.office.universityText')}</p>
          </article>

          <article className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="stickynote" size={20} />
              <h3 className="text-sm font-semibold">{t('contact.office.availabilityTitle')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('contact.office.availabilityText')}</p>
          </article>

          <article className="rounded-md border p-4 hover:bg-muted/50 transition-colors sm:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="globe" size={20} />
              <h3 className="text-sm font-semibold">{t('contact.office.platformTitle')}</h3>
            </div>
            <p className="text-sm">{t('contact.office.platformTextMain')}</p>
            <p className="text-sm text-muted-foreground">{t('contact.office.platformTextDesc')}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
