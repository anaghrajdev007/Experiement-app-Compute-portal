import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Check, AlertCircle, Eye, Volume2, QrCode } from 'lucide-react';

interface FormData {
  deviceId: string;
  model: string;
  serialNumber: string;
  setupKey: string;
}

interface ValidationErrors {
  deviceId?: string;
  model?: string;
  serialNumber?: string;
  setupKey?: string;
}

const ManualEntry: React.FC = () => {
  const { setCurrentScreen, currentDevice } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    deviceId: '',
    model: '',
    serialNumber: '',
    setupKey: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'deviceId':
        if (!value) return 'Device ID is required';
        if (!/^[A-Z0-9]{12}$/.test(value)) return 'Device ID must be 12 alphanumeric characters';
        break;
      case 'model':
        if (!value) return 'Model is required';
        if (value.length < 3) return 'Model must be at least 3 characters';
        break;
      case 'serialNumber':
        if (!value) return 'Serial number is required';
        if (!/^CP[A-Z0-9]{8}$/.test(value)) return 'Serial number format: CP + 8 characters';
        break;
      case 'setupKey':
        if (!value) return 'Setup key is required';
        if (!/^[A-Z0-9]{16}$/.test(value)) return 'Setup key must be 16 alphanumeric characters';
        break;
    }
    return undefined;
  };

  const handleInputChange = (name: string, value: string) => {
    if (['deviceId', 'serialNumber', 'setupKey'].includes(name)) {
      value = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    const error = validateField(name, value);
    if (error && touched[name]) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const getValidationIcon = (fieldName: string) => {
    const value = formData[fieldName as keyof FormData];
    const error = errors[fieldName as keyof ValidationErrors];
    
    if (!value) return null;
    if (error) return <AlertCircle className="w-4 h-4 text-red-400" />;
    return <Check className="w-4 h-4 text-green-400" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: ValidationErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });
    
    setErrors(newErrors);
    setTouched({ deviceId: true, model: true, serialNumber: true, setupKey: true });
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentScreen('bluetooth-pairing');
    }, 1500);
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setCurrentScreen('qr-scanner')}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-2"
            aria-label="Go back to QR scanner"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" role="heading" aria-level={1}>Enter Device Details</h1>
            <p className="text-slate-400">Manually input device information</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Form Validation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Screen Reader Ready</span>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-500/10 border-blue-500/30">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Enter the device details found on the device label or documentation.
          </AlertDescription>
        </Alert>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deviceId" className="text-slate-200">
                  Device ID *
                </Label>
                <div className="relative">
                  <Input
                    id="deviceId"
                    value={formData.deviceId}
                    onChange={(e) => handleInputChange('deviceId', e.target.value)}
                    onBlur={() => handleBlur('deviceId')}
                    placeholder="COMPUTEPORTAL1"
                    maxLength={12}
                    className={`bg-slate-700 border-slate-600 text-white font-mono pr-10 ${
                      errors.deviceId ? 'border-red-500' : touched.deviceId && !errors.deviceId ? 'border-green-500' : ''
                    }`}
                    aria-describedby="deviceId-error deviceId-help"
                    aria-invalid={!!errors.deviceId}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon('deviceId')}
                  </div>
                </div>
                {errors.deviceId && (
                  <p id="deviceId-error" className="text-red-400 text-sm" role="alert">{errors.deviceId}</p>
                )}
                <p id="deviceId-help" className="text-slate-400 text-xs">
                  12 alphanumeric characters (e.g., COMPUTEPORTAL1)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-slate-200">
                  Model *
                </Label>
                <div className="relative">
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    onBlur={() => handleBlur('model')}
                    placeholder="Edge-Pro"
                    className={`bg-slate-700 border-slate-600 text-white pr-10 ${
                      errors.model ? 'border-red-500' : touched.model && !errors.model ? 'border-green-500' : ''
                    }`}
                    aria-describedby="model-error"
                    aria-invalid={!!errors.model}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon('model')}
                  </div>
                </div>
                {errors.model && (
                  <p id="model-error" className="text-red-400 text-sm" role="alert">{errors.model}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="text-slate-200">
                  Serial Number *
                </Label>
                <div className="relative">
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    onBlur={() => handleBlur('serialNumber')}
                    placeholder="CPA1B2C3D4"
                    maxLength={10}
                    className={`bg-slate-700 border-slate-600 text-white font-mono pr-10 ${
                      errors.serialNumber ? 'border-red-500' : touched.serialNumber && !errors.serialNumber ? 'border-green-500' : ''
                    }`}
                    aria-describedby="serialNumber-error serialNumber-help"
                    aria-invalid={!!errors.serialNumber}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon('serialNumber')}
                  </div>
                </div>
                {errors.serialNumber && (
                  <p id="serialNumber-error" className="text-red-400 text-sm" role="alert">{errors.serialNumber}</p>
                )}
                <p id="serialNumber-help" className="text-slate-400 text-xs">
                  Format: CP + 8 characters (e.g., CPA1B2C3D4)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupKey" className="text-slate-200">
                  Setup Key *
                </Label>
                <div className="relative">
                  <Input
                    id="setupKey"
                    value={formData.setupKey}
                    onChange={(e) => handleInputChange('setupKey', e.target.value)}
                    onBlur={() => handleBlur('setupKey')}
                    placeholder="A1B2C3D4E5F6G7H8"
                    maxLength={16}
                    className={`bg-slate-700 border-slate-600 text-white font-mono pr-10 ${
                      errors.setupKey ? 'border-red-500' : touched.setupKey && !errors.setupKey ? 'border-green-500' : ''
                    }`}
                    aria-describedby="setupKey-error setupKey-help"
                    aria-invalid={!!errors.setupKey}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon('setupKey')}
                  </div>
                </div>
                {errors.setupKey && (
                  <p id="setupKey-error" className="text-red-400 text-sm" role="alert">{errors.setupKey}</p>
                )}
                <p id="setupKey-help" className="text-slate-400 text-xs">
                  16 alphanumeric characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
                  aria-label="Submit device information"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Validating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Submit
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setCurrentScreen('qr-scanner')}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  aria-label="Go back to QR scanner"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Back to QR Scan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualEntry;