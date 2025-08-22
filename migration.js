// migration-script.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmw87RamFSiXUcCtFk9fJxm1N4ZKqOMm4",
  authDomain: "gas-stations-app-8ea2a.firebaseapp.com",
  projectId: "gas-stations-app-8ea2a",
  storageBucket: "gas-stations-app-8ea2a.firebasestorage.app",
  messagingSenderId: "547717452820",
  appId: "1:547717452820:web:3c35ec2731e5ad36098301"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to migrate data to new schema
async function migrateGasStations() {
  try {
    // Step 1: Get all existing data (if any)
    const oldCollectionRef = collection(db, 'gas-stations');
    const oldSnapshot = await getDocs(oldCollectionRef);
    
    console.log(`Found ${oldSnapshot.size} existing documents`);
    
    // Step 2: Transform old data to new schema (if needed)
    const migratedData = [];
    oldSnapshot.forEach((doc) => {
      const oldData = doc.data();
      
      // Transform to new schema
      const newData = {
        'Raison sociale': oldData.name || '',
        'Marque': oldData.brand || '',
        'Nom de Station': oldData.name || '',
        'Propriétaire': '',
        'Gérant': '',
        'CIN Gérant': '',
        'Adesse': oldData.address || '',
        'Latitude': oldData.latitude || 0,
        'Longitude': oldData.longitude || 0,
        'Commune': '',
        'Province': '',
        'Type': 'service', // default value
        'Type Autorisation': 'création', // default value
        'Date Creation': new Date(),
        'numéro de création': '',
        'Date Mise en service': new Date(),
        'numéro de Mise en service': '',
        'Capacité Gasoil': 0,
        'Capacité SSP': 0,
        'numéro de Téléphone': ''
      };
      
      migratedData.push(newData);
    });
    
    // Step 3: Clear old collection (optional)
    for (const docSnapshot of oldSnapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }
    
    // Step 4: Add new data
    for (const newStation of migratedData) {
      await addDoc(collection(db, 'gasStations'), newStation);
    }
    
    console.log(`Migration completed: ${migratedData.length} documents migrated`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Function to add sample data with new schema
async function addSampleData() {
  const sampleStations = [
    {
      'Raison sociale': 'Station 2',
      'Marque': 'Afriquia',
      'Nom de Station': 'Afriquia 2',
      'Propriétaire': 'Ali 2 Alami',
      'Gérant': '2 2 Bennani',
      'CIN Gérant': 'AB123456',
      'Adesse': 'Avenue Mohammed V, Casablanca',
      'Latitude': 32.5731,
      'Longitude': -8.5898,
      'Commune': 'Casablanca',
      'Province': 'Casablanca-Settat',
      'Type': 'service',
      'Type Autorisation': 'création',
      'Date Creation': new Date('2020-01-15'),
      'numéro de création': 'CR2020001',
      'Date Mise en service': new Date('2020-03-01'),
      'numéro de Mise en service': 'MS2020001',
      'Capacité Gasoil': 50000,
      'Capacité SSP': 30000,
      'numéro de Téléphone': '0522-123456'
    }
  ];
  
  try {
    for (const station of sampleStations) {
      await addDoc(collection(db, 'gasStations'), station);
    }
    console.log('Sample data added successfully');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

// Run migration
// migrateGasStations();

// Or add sample data
 addSampleData();