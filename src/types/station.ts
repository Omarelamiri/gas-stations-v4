export type StationType = 'service' | 'remplissage';

export type StationAuthorization = 'création' | 'transformation' | 'transfert' | 'changement de marques';


export interface GasStation {
  id: string;
  "Raison sociale": string;
  Marque: string;
  "Nom de Station": string;
  Propriétaire: string;
  Gérant: string;
  "CIN Gérant": string;
  Adesse: string;
  Latitude: number | null;
  Longitude: number | null;
  Commune: string;
  Province: string;
  Type: string;
  "Type Autorisation": string;
  "Date Creation": Date | null;
  "numéro de création": string;
  "Date Mise en service": Date | null;
  "numéro de Mise en service": string;
  "Capacité Gasoil": number | null;
  "Capacité SSP": number | null;
  "numéro de Téléphone": string;
}


/** Form state uses strings; we coerce on submit */
export interface GasStationFormData {
id?: string;
'Raison sociale': string;
'Marque': string;
'Nom de Station': string;
'Propriétaire': string;
'Gérant': string;
'CIN Gérant': string;
'Adesse': string;
'Latitude': string; // string in inputs; parsed to number
'Longitude': string; // string in inputs; parsed to number
'Commune': string;
'Province': string;
'Type': StationType;
'Type Autorisation': StationAuthorization;
'Date Creation': string; // ISO or yyyy-mm-dd from input
'numéro de création': string;
'Date Mise en service': string;
'numéro de Mise en service': string;
'Capacité Gasoil': string; // parsed to number
'Capacité SSP': string; // parsed to number
'numéro de Téléphone': string;
}