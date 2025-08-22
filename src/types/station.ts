export interface GasStation {
  id: string;
  'Raison sociale': string;
  'Marque': string;
  'Nom de Station': string;
  'Propriétaire': string;
  'Gérant': string;
  'CIN Gérant': string;
  'Adesse': string;
  'Latitude': number;
  'Longitude': number;
  'Commune': string;
  'Province': string;
  'Type': 'service' | 'remplissage';
  'Type Autorisation': 'création' | 'transformation' | 'transfert' | 'changement de marques';
  'Date Creation': Date;
  'numéro de création': string;
  'Date Mise en service': Date;
  'numéro de Mise en service': string;
  'Capacité Gasoil': number;
  'Capacité SSP': number;
  'numéro de Téléphone': string;
}

export interface NewGasStation {
  'Raison sociale': string;
  'Marque': string;
  'Nom de Station': string;
  'Propriétaire': string;
  'Gérant': string;
  'CIN Gérant': string;
  'Adesse': string;
  'Latitude': string;
  'Longitude': string;
  'Commune': string;
  'Province': string;
  'Type': 'service' | 'remplissage';
  'Type Autorisation': 'création' | 'transformation' | 'transfert' | 'changement de marques';
  'Date Creation': string;
  'numéro de création': string;
  'Date Mise en service': string;
  'numéro de Mise en service': string;
  'Capacité Gasoil': string;
  'Capacité SSP': string;
  'numéro de Téléphone': string;
}