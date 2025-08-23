import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, ArrowUpDown, Thermometer, Ruler, Weight, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { useAnalytics } from '@/hooks/use-analytics';

interface ConversionHistory {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  category: string;
  timestamp: string;
}

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('length');
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const { trackEvent } = useAnalytics();

  // Conversion factors and units
  const units = {
    length: {
      meters: { factor: 1, name: 'Meters (m)' },
      kilometers: { factor: 0.001, name: 'Kilometers (km)' },
      centimeters: { factor: 100, name: 'Centimeters (cm)' },
      millimeters: { factor: 1000, name: 'Millimeters (mm)' },
      inches: { factor: 39.3701, name: 'Inches (in)' },
      feet: { factor: 3.28084, name: 'Feet (ft)' },
      yards: { factor: 1.09361, name: 'Yards (yd)' },
      miles: { factor: 0.000621371, name: 'Miles (mi)' },
    },
    weight: {
      kilograms: { factor: 1, name: 'Kilograms (kg)' },
      grams: { factor: 1000, name: 'Grams (g)' },
      pounds: { factor: 2.20462, name: 'Pounds (lb)' },
      ounces: { factor: 35.274, name: 'Ounces (oz)' },
      stones: { factor: 0.157473, name: 'Stones (st)' },
      tons: { factor: 0.001, name: 'Metric Tons (t)' },
    },
    temperature: {
      celsius: { name: 'Celsius (°C)' },
      fahrenheit: { name: 'Fahrenheit (°F)' },
      kelvin: { name: 'Kelvin (K)' },
      rankine: { name: 'Rankine (°R)' },
    },
    volume: {
      liters: { factor: 1, name: 'Liters (L)' },
      milliliters: { factor: 1000, name: 'Milliliters (mL)' },
      gallons_us: { factor: 0.264172, name: 'US Gallons (gal)' },
      gallons_uk: { factor: 0.219969, name: 'UK Gallons (gal)' },
      quarts: { factor: 1.05669, name: 'Quarts (qt)' },
      pints: { factor: 2.11338, name: 'Pints (pt)' },
      cups: { factor: 4.22675, name: 'Cups' },
      fluid_ounces: { factor: 33.814, name: 'Fluid Ounces (fl oz)' },
    },
    area: {
      square_meters: { factor: 1, name: 'Square Meters (m²)' },
      square_kilometers: { factor: 0.000001, name: 'Square Kilometers (km²)' },
      square_centimeters: { factor: 10000, name: 'Square Centimeters (cm²)' },
      square_feet: { factor: 10.7639, name: 'Square Feet (ft²)' },
      square_inches: { factor: 1550, name: 'Square Inches (in²)' },
      acres: { factor: 0.000247105, name: 'Acres' },
      hectares: { factor: 0.0001, name: 'Hectares (ha)' },
    },
    speed: {
      meters_per_second: { factor: 1, name: 'Meters/Second (m/s)' },
      kilometers_per_hour: { factor: 3.6, name: 'Kilometers/Hour (km/h)' },
      miles_per_hour: { factor: 2.23694, name: 'Miles/Hour (mph)' },
      feet_per_second: { factor: 3.28084, name: 'Feet/Second (ft/s)' },
      knots: { factor: 1.94384, name: 'Knots (kn)' },
    },
  };

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free Unit Converter - Convert Length, Weight, Temperature & More | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert units for length, weight, temperature, volume, area, and speed. Free online unit converter with accurate calculations and conversion history.');
    }

    // Load conversion history
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Set default units
    setFromUnit('meters');
    setToUnit('feet');
  }, []);

  useEffect(() => {
    // Reset units when category changes
    const categoryUnits = Object.keys(units[activeCategory as keyof typeof units]);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1] || categoryUnits[0]);
  }, [activeCategory]);

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius = value;
    switch (from) {
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      case 'rankine':
        celsius = (value - 491.67) * 5/9;
        break;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  };

  const performConversion = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || !fromUnit || !toUnit) {
      setResult('');
      return;
    }

    let convertedValue: number;

    if (activeCategory === 'temperature') {
      convertedValue = convertTemperature(value, fromUnit, toUnit);
    } else {
      const categoryUnits = units[activeCategory as keyof typeof units] as any;
      const fromFactor = categoryUnits[fromUnit]?.factor || 1;
      const toFactor = categoryUnits[toUnit]?.factor || 1;
      
      // Convert to base unit, then to target unit
      convertedValue = (value / fromFactor) * toFactor;
    }

    const formattedResult = convertedValue.toLocaleString('en-US', {
      maximumFractionDigits: 8,
      minimumFractionDigits: 0,
    });

    setResult(formattedResult);

    // Add to history
    const historyItem: ConversionHistory = {
      id: Math.random().toString(36).substr(2, 9),
      fromValue: value,
      fromUnit,
      toValue: convertedValue,
      toUnit,
      category: activeCategory,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [historyItem, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(newHistory));

    trackEvent('tool_used', 'unit_converter', `${activeCategory}_conversion`);
  };

  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      performConversion();
    }
  }, [inputValue, fromUnit, toUnit, activeCategory]);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
  };

  const getUnitDisplayName = (unitKey: string, category: string): string => {
    const categoryUnits = units[category as keyof typeof units] as any;
    return categoryUnits[unitKey]?.name || unitKey;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'length': return <Ruler className="w-5 h-5" />;
      case 'weight': return <Weight className="w-5 h-5" />;
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'volume': return <Calculator className="w-5 h-5" />;
      case 'area': return <Calculator className="w-5 h-5" />;
      case 'speed': return <Clock className="w-5 h-5" />;
      default: return <Calculator className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Unit Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert units for length, weight, temperature, volume, area, and speed with instant calculations.
          </p>
        </div>

        {/* Category Tabs */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="length" className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4" />
                  <span className="hidden sm:inline">Length</span>
                </TabsTrigger>
                <TabsTrigger value="weight" className="flex items-center space-x-2">
                  <Weight className="w-4 h-4" />
                  <span className="hidden sm:inline">Weight</span>
                </TabsTrigger>
                <TabsTrigger value="temperature" className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="hidden sm:inline">Temp</span>
                </TabsTrigger>
                <TabsTrigger value="volume" className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:inline">Volume</span>
                </TabsTrigger>
                <TabsTrigger value="area" className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:inline">Area</span>
                </TabsTrigger>
                <TabsTrigger value="speed" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Speed</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Converter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getCategoryIcon(activeCategory)}
                <span>
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Converter
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Value */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Enter Value
                </label>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value to convert"
                  className="text-lg"
                />
              </div>

              {/* From Unit */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  From
                </label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(units[activeCategory as keyof typeof units] || {}).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {(unit as any).name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button onClick={swapUnits} variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Unit */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  To
                </label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(units[activeCategory as keyof typeof units] || {}).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {(unit as any).name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Result */}
              {result && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result:</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {result} {getUnitDisplayName(toUnit, activeCategory).split(' ')[1]?.replace(/[()]/g, '') || ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {inputValue} {getUnitDisplayName(fromUnit, activeCategory).split(' ')[1]?.replace(/[()]/g, '') || ''} = {result} {getUnitDisplayName(toUnit, activeCategory).split(' ')[1]?.replace(/[()]/g, '') || ''}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Recent Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.fromValue.toLocaleString()} {getUnitDisplayName(item.fromUnit, item.category).split(' ')[1]?.replace(/[()]/g, '') || ''} = {item.toValue.toLocaleString('en-US', { maximumFractionDigits: 4 })} {getUnitDisplayName(item.toUnit, item.category).split(' ')[1]?.replace(/[()]/g, '') || ''}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category} • {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setActiveCategory(item.category);
                            setInputValue(item.fromValue.toString());
                            setFromUnit(item.fromUnit);
                            setToUnit(item.toUnit);
                          }}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No conversions yet</p>
                  <p className="text-sm text-gray-400">Start converting to see your history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Accurate Calculations</h3>
            <p className="text-gray-600 dark:text-gray-300">Precise conversions using standardized conversion factors and formulas.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowUpDown className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Categories</h3>
            <p className="text-gray-600 dark:text-gray-300">Convert length, weight, temperature, volume, area, and speed units.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Conversion History</h3>
            <p className="text-gray-600 dark:text-gray-300">Keep track of recent conversions for quick reference and reuse.</p>
          </div>
        </div>
      </div>
    </div>
  );
}