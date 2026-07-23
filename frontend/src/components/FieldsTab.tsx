import React from 'react';
import { MapPin, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { mockFields } from '../mockData';

interface FieldsTabProps {
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onOpenDetail: (id: string) => void;
}

export default function FieldsTab({ selectedFieldId, onSelectField, onOpenDetail }: FieldsTabProps) {
  return (
    <div className="flex-1 px-6 pt-6">
      <h2 className="text-2xl font-bold text-[#1B331B] mb-6">Tarlalar</h2>
      
      <div className="space-y-4">
        {mockFields.map((field) => (
          <div 
            key={field.id}
            onClick={() => {
              onSelectField(field.id);
              onOpenDetail(field.id);
            }}
            className={`rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer transition-all hover:shadow-md ${field.id === selectedFieldId ? 'ring-2 ring-[#4CAF50] ring-offset-2 ring-offset-[#F4FAF5]' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-[#1B331B]">{field.name}</h3>
                <div className="mt-1 flex items-center space-x-1.5 text-sm text-[#597360]">
                  <MapPin className="h-4 w-4" />
                  <span>{field.location}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#8EA694]" />
            </div>
            
            <div className="flex items-center justify-between mt-4 border-t border-[#E8F1EA] pt-4">
              <div className="text-sm">
                <span className="text-[#8EA694]">Alan: </span>
                <span className="font-semibold text-[#1B331B]">{field.area}</span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {field.status === 'Sağlıklı' ? (
                  <CheckCircle2 className="h-4 w-4 text-[#4CAF50]" />
                ) : field.status === 'Dikkat' ? (
                  <AlertTriangle className="h-4 w-4 text-[#FF9800]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[#F44336]" />
                )}
                <span className={`text-sm font-semibold ${
                  field.status === 'Sağlıklı' ? 'text-[#4CAF50]' : 
                  field.status === 'Dikkat' ? 'text-[#FF9800]' : 'text-[#F44336]'
                }`}>{field.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

