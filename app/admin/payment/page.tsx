"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getPaymentInfo, updatePaymentInfo } from "@/actions";

export default function AdminPaymentPage() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPayment() {
      const data = await getPaymentInfo();
      if (data) setForm(data);
      setLoading(false);
    }
    fetchPayment();
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePaymentInfo(form);
      toast.success("Payment info updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Payment Info</h1>

      {/* Zelle */}
      <div>
        <Label>Zelle Email</Label>
        <Input
          value={form.zelleEmail || ""}
          onChange={(e) => handleChange("zelleEmail", e.target.value)}
        />
        <Label>Zelle Phone</Label>
        <Input
          value={form.zellePhone || ""}
          onChange={(e) => handleChange("zellePhone", e.target.value)}
        />
      </div>

      {/* CashApp */}
      <div>
        <Label>CashApp Email</Label>
        <Input
          value={form.cashAppEmail || ""}
          onChange={(e) => handleChange("cashAppEmail", e.target.value)}
        />
        <Label>CashApp Username</Label>
        <Input
          value={form.cashAppUsername || ""}
          onChange={(e) => handleChange("cashAppUsername", e.target.value)}
        />
      </div>

      {/* Chime */}
      <div>
        <Label>Chime Email</Label>
        <Input
          value={form.chimeEmail || ""}
          onChange={(e) => handleChange("chimeEmail", e.target.value)}
        />
        <Label>Chime Phone</Label>
        <Input
          value={form.chimePhone || ""}
          onChange={(e) => handleChange("chimePhone", e.target.value)}
        />
        <Label>Chime Account Name</Label>
        <Input
          value={form.chimeAccountName || ""}
          onChange={(e) => handleChange("chimeAccountName", e.target.value)}
        />
        <Label>Chime Account Number</Label>
        <Input
          value={form.chimeAccountNumber || ""}
          onChange={(e) => handleChange("chimeAccountNumber", e.target.value)}
        />
        <Label>Chime Routing Number</Label>
        <Input
          value={form.chimeRoutingNumber || ""}
          onChange={(e) => handleChange("chimeRoutingNumber", e.target.value)}
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Payment Info"}
      </Button>
    </div>
  );
}
