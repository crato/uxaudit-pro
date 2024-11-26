// File: packages/frontend/src/pages/tools/contrast-verifier.tsx
import { ContrastVerifierComponent } from '@/features/contrast-verifier/ContrastVerifierComponent';

export default function ContrastVerifierPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Color Contrast Verification Tool</h1>
      <ContrastVerifierComponent />
    </div>
  );
}