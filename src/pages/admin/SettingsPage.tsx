import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminSettings, updateAdminSettings, uploadAdminFile } from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/media';
import type { SiteSettings } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

export function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['adminSettings'], queryFn: fetchAdminSettings });
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setTypewriterText(data.typewriterWords.join('\n'));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => updateAdminSettings({
      ...form!,
      typewriterWords: typewriterText.split('\n').map((line) => line.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      toast({ title: 'Settings saved' });
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  });

  const updateSocial = (index: number, field: 'label' | 'href', value: string) => {
    if (!form) return;
    const socialLinks = [...form.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    setForm({ ...form, socialLinks });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !form) return;
    setUploadingLogo(true);
    try {
      const result = await uploadAdminFile(file);
      setForm({ ...form, logoUrl: result.url });
      toast({ title: 'Logo uploaded', description: 'Click Save Settings to apply.' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unable to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  if (isLoading || !form) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Update branding, hero content, contact info, and social links.</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 grid gap-6">
        <div className="space-y-3">
          <Label>Logo</Label>
          <div className="flex items-center gap-4">
            <img src={resolveMediaUrl(form.logoUrl)} alt="Logo preview" className="h-16 w-auto rounded-lg border border-border bg-muted p-2" />
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border cursor-pointer hover:bg-muted">
              <Upload className="h-4 w-4" />
              <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
            </label>
          </div>
          <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="/assets/logo.svg or /uploads/..." />
        </div>

        <div className="space-y-2">
          <Label>Hero Badge</Label>
          <Input value={form.heroBadge} onChange={(e) => setForm({ ...form, heroBadge: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Hero Headline</Label>
          <Input value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Hero Description</Label>
          <Textarea value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Typewriter Words (one per line)</Label>
          <Textarea value={typewriterText} onChange={(e) => setTypewriterText(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.contactAddress} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Working Hours</Label>
            <Input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Social Links</Label>
          {form.socialLinks.map((link, index) => (
            <div key={link.platform} className="grid md:grid-cols-2 gap-3">
              <Input value={link.label} onChange={(e) => updateSocial(index, 'label', e.target.value)} placeholder={`${link.platform} label`} />
              <Input value={link.href} onChange={(e) => updateSocial(index, 'href', e.target.value)} placeholder={`${link.platform} URL`} />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
