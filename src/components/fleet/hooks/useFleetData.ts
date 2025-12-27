
import { useState } from "react";
import { Bus, Driver, Minder, FormItem } from "../types";

const initialBuses: Bus[] = [
  {
    id: 1,
    registrationNumber: "KCA 123A",
    busNumber: "B001",
    licensePlate: "KCA 123A",
    schoolName: "Springfield Elementary School",
    make: "Toyota",
    model: "Hiace",
    seatsCapacity: 14,
    type: "Mini Bus",
    status: "Active",
    driver: "John Doe",
    minder: "Sarah Wilson"
  },
  {
    id: 2,
    registrationNumber: "KCB 456B",
    busNumber: "B002",
    licensePlate: "KCB 456B",
    schoolName: "Oak Valley High School",
    make: "Nissan",
    model: "Civilian",
    seatsCapacity: 25,
    type: "School Bus",
    status: "Active",
    driver: "Jane Smith",
    minder: "David Brown"
  },
  {
    id: 3,
    registrationNumber: "KCC 789C",
    busNumber: "B003",
    licensePlate: "KCC 789C",
    schoolName: "Maplewood Primary",
    make: "Isuzu",
    model: "NPR",
    seatsCapacity: 33,
    type: "School Bus",
    status: "Inactive",
    driver: "Mike Johnson",
    minder: "Lisa Davis"
  },
  {
    id: 4,
    registrationNumber: "KCD 234D",
    busNumber: "B004",
    licensePlate: "KCD 234D",
    schoolName: "Nairobi Primary School",
    make: "Toyota",
    model: "Coaster",
    seatsCapacity: 29,
    type: "School Bus",
    status: "Active",
    driver: "Richard Kimani",
    minder: "Mary Wanjiku"
  },
  {
    id: 5,
    registrationNumber: "KCE 567E",
    busNumber: "B005",
    licensePlate: "KCE 567E",
    schoolName: "Brookhouse School",
    make: "Mercedes-Benz",
    model: "Sprinter",
    seatsCapacity: 22,
    type: "Mini Bus",
    status: "Active",
    driver: "Samuel Maina",
    minder: "Grace Achieng"
  },
  {
    id: 6,
    registrationNumber: "KCF 890F",
    busNumber: "B006",
    licensePlate: "KCF 890F",
    schoolName: "Braeburn School",
    make: "Scania",
    model: "K-Series",
    seatsCapacity: 60,
    type: "Big Bus",
    status: "Active",
    driver: "Daniel Omondi",
    minder: "Faith Muthoni"
  },
  {
    id: 7,
    registrationNumber: "KCG 123G",
    busNumber: "B007",
    licensePlate: "KCG 123G",
    schoolName: "Moi Educational Centre",
    make: "Mitsubishi",
    model: "Rosa",
    seatsCapacity: 28,
    type: "School Bus",
    status: "Active",
    driver: "Peter Njoroge",
    minder: "Alice Wambui"
  },
  {
    id: 8,
    registrationNumber: "KCH 456H",
    busNumber: "B008",
    licensePlate: "KCH 456H",
    schoolName: "Hillcrest International School",
    make: "Volvo",
    model: "9700",
    seatsCapacity: 49,
    type: "Big Bus",
    status: "Inactive",
    driver: "George Mutua",
    minder: "Joyce Nyambura"
  },
  {
    id: 9,
    registrationNumber: "KCJ 789J",
    busNumber: "B009",
    licensePlate: "KCJ 789J",
    schoolName: "St. Mary's School",
    make: "Hino",
    model: "RK1J",
    seatsCapacity: 62,
    type: "Big Bus",
    status: "Active",
    driver: "Stephen Kamau",
    minder: "Ruth Chebet"
  },
  {
    id: 10,
    registrationNumber: "KCK 012K",
    busNumber: "B010",
    licensePlate: "KCK 012K",
    schoolName: "Alliance High School",
    make: "Nissan",
    model: "UD",
    seatsCapacity: 65,
    type: "Big Bus",
    status: "Active",
    driver: "Joseph Gitau",
    minder: "Esther Chepkorir"
  },
  {
    id: 11,
    registrationNumber: "KCL 345L",
    busNumber: "B011",
    licensePlate: "KCL 345L",
    schoolName: "Sunshine Academy",
    make: "Toyota",
    model: "Coaster",
    seatsCapacity: 29,
    type: "School Bus",
    status: "Active",
    driver: "James Oduor",
    minder: "Nancy Adhiambo"
  },
  {
    id: 12,
    registrationNumber: "KCM 678M",
    busNumber: "B012",
    licensePlate: "KCM 678M",
    schoolName: "Greenvale School",
    make: "Mercedes-Benz",
    model: "OH1836",
    seatsCapacity: 56,
    type: "Big Bus",
    status: "Inactive",
    driver: "Eric Nyaga",
    minder: "Mercy Wangari"
  },
  {
    id: 13,
    registrationNumber: "KCN 901N",
    busNumber: "B013",
    licensePlate: "KCN 901N",
    schoolName: "Riverdale Academy",
    make: "Isuzu",
    model: "Journey-K",
    seatsCapacity: 33,
    type: "School Bus",
    status: "Active",
    driver: "Thomas Njeru",
    minder: "Elizabeth Njeri"
  },
  {
    id: 14,
    registrationNumber: "KCP 234P",
    busNumber: "B014",
    licensePlate: "KCP 234P",
    schoolName: "Greenhill Academy",
    make: "Toyota",
    model: "Hiace",
    seatsCapacity: 14,
    type: "Mini Bus",
    status: "Active",
    driver: "Michael Njenga",
    minder: "Catherine Wangui"
  },
  {
    id: 15,
    registrationNumber: "KCQ 567Q",
    busNumber: "B015",
    licensePlate: "KCQ 567Q",
    schoolName: "Starehe Boys Centre",
    make: "Scania",
    model: "F-Series",
    seatsCapacity: 67,
    type: "Big Bus",
    status: "Active",
    driver: "Patrick Mwangi",
    minder: "Beatrice Omondi"
  },
  {
    id: 16,
    registrationNumber: "KCR 890R",
    busNumber: "B016",
    licensePlate: "KCR 890R",
    schoolName: "Kenya High School",
    make: "Nissan",
    model: "Civilian",
    seatsCapacity: 26,
    type: "School Bus",
    status: "Active",
    driver: "Victor Kipkoech",
    minder: "Jennifer Akinyi"
  },
  {
    id: 17,
    registrationNumber: "KCS 123S",
    busNumber: "B017",
    licensePlate: "KCS 123S",
    schoolName: "Nairobi Academy",
    make: "Mitsubishi",
    model: "Rosa",
    seatsCapacity: 28,
    type: "School Bus",
    status: "Inactive",
    driver: "David Kimathi",
    minder: "Diana Moraa"
  },
  {
    id: 18,
    registrationNumber: "KCT 456T",
    busNumber: "B018",
    licensePlate: "KCT 456T",
    schoolName: "Riara Springs Academy",
    make: "Isuzu",
    model: "MV",
    seatsCapacity: 33,
    type: "School Bus",
    status: "Active",
    driver: "Dennis Kiptoo",
    minder: "Lucy Mwende"
  },
  {
    id: 19,
    registrationNumber: "KCU 789U",
    busNumber: "B019",
    licensePlate: "KCU 789U",
    schoolName: "International School of Kenya",
    make: "Mercedes-Benz",
    model: "Sprinter",
    seatsCapacity: 22,
    type: "Mini Bus",
    status: "Active",
    driver: "Benjamin Oteng",
    minder: "Sharon Kioko"
  },
  {
    id: 20,
    registrationNumber: "KCV 012V",
    busNumber: "B020",
    licensePlate: "KCV 012V",
    schoolName: "Aga Khan Academy",
    make: "Volvo",
    model: "9800",
    seatsCapacity: 52,
    type: "Big Bus",
    status: "Active",
    driver: "Kenneth Mwai",
    minder: "Tabitha Mueni"
  }
];

const initialDrivers: Driver[] = [
  {
    id: 1,
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
    name: "John Doe",
    fullName: "John Doe",
    licenseNumber: "DL123456789",
    phone: "+254 722 123 456",
    schoolName: "Springfield Elementary School",
    pin: "1234",
    status: "Active"
  },
  {
    id: 2,
    photo: "",
    name: "Jane Smith",
    fullName: "Jane Smith",
    licenseNumber: "DL987654321",
    phone: "+254 733 987 654",
    schoolName: "Oak Valley High School", 
    pin: "5678",
    status: "Active"
  },
  {
    id: 3,
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
    name: "Mike Johnson",
    fullName: "Mike Johnson",
    licenseNumber: "DL555777999",
    phone: "+254 744 555 777",
    schoolName: "Maplewood Primary",
    pin: "9012",
    status: "Inactive"
  },
  {
    id: 4,
    photo: "",
    name: "Richard Kimani",
    fullName: "Richard Kimani",
    licenseNumber: "DL123789456",
    phone: "+254 722 345 678",
    schoolName: "Nairobi Primary School",
    pin: "3456",
    status: "Active"
  },
  {
    id: 5,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    name: "Samuel Maina",
    fullName: "Samuel Maina",
    licenseNumber: "DL456123789",
    phone: "+254 733 456 789",
    schoolName: "Brookhouse School",
    pin: "7890",
    status: "Active"
  },
  {
    id: 6,
    photo: "",
    name: "Daniel Omondi",
    fullName: "Daniel Omondi",
    licenseNumber: "DL789456123",
    phone: "+254 744 789 123",
    schoolName: "Braeburn School",
    pin: "1357",
    status: "Active"
  },
  {
    id: 7,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    name: "Peter Njoroge",
    fullName: "Peter Njoroge",
    licenseNumber: "DL234567891",
    phone: "+254 722 234 567",
    schoolName: "Moi Educational Centre",
    pin: "2468",
    status: "Active"
  },
  {
    id: 8,
    photo: "",
    name: "George Mutua",
    fullName: "George Mutua",
    licenseNumber: "DL345678912",
    phone: "+254 733 345 678",
    schoolName: "Hillcrest International School",
    pin: "3579",
    status: "Inactive"
  },
  {
    id: 9,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    name: "Stephen Kamau",
    fullName: "Stephen Kamau",
    licenseNumber: "DL456789123",
    phone: "+254 744 456 789",
    schoolName: "St. Mary's School",
    pin: "4680",
    status: "Active"
  },
  {
    id: 10,
    photo: "",
    name: "Joseph Gitau",
    fullName: "Joseph Gitau",
    licenseNumber: "DL567891234",
    phone: "+254 722 567 891",
    schoolName: "Alliance High School",
    pin: "5791",
    status: "Active"
  },
  {
    id: 11,
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    name: "James Oduor",
    fullName: "James Oduor",
    licenseNumber: "DL678912345",
    phone: "+254 733 678 912",
    schoolName: "Sunshine Academy",
    pin: "6802",
    status: "Active"
  },
  {
    id: 12,
    photo: "",
    name: "Eric Nyaga",
    fullName: "Eric Nyaga",
    licenseNumber: "DL789123456",
    phone: "+254 744 789 123",
    schoolName: "Greenvale School",
    pin: "7913",
    status: "Inactive"
  },
  {
    id: 13,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    name: "Thomas Njeru",
    fullName: "Thomas Njeru",
    licenseNumber: "DL891234567",
    phone: "+254 722 891 234",
    schoolName: "Riverdale Academy",
    pin: "8024",
    status: "Active"
  },
  {
    id: 14,
    photo: "",
    name: "Michael Njenga",
    fullName: "Michael Njenga",
    licenseNumber: "DL912345678",
    phone: "+254 733 912 345",
    schoolName: "Greenhill Academy",
    pin: "9135",
    status: "Active"
  },
  {
    id: 15,
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face",
    name: "Patrick Mwangi",
    fullName: "Patrick Mwangi",
    licenseNumber: "DL123456780",
    phone: "+254 744 123 456",
    schoolName: "Starehe Boys Centre",
    pin: "0246",
    status: "Active"
  },
  {
    id: 16,
    photo: "",
    name: "Victor Kipkoech",
    fullName: "Victor Kipkoech",
    licenseNumber: "DL234567801",
    phone: "+254 722 234 567",
    schoolName: "Kenya High School",
    pin: "1357",
    status: "Active"
  },
  {
    id: 17,
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
    name: "David Kimathi",
    fullName: "David Kimathi",
    licenseNumber: "DL345678012",
    phone: "+254 733 345 678",
    schoolName: "Nairobi Academy",
    pin: "2468",
    status: "Inactive"
  },
  {
    id: 18,
    photo: "",
    name: "Dennis Kiptoo",
    fullName: "Dennis Kiptoo",
    licenseNumber: "DL456780123",
    phone: "+254 744 456 780",
    schoolName: "Riara Springs Academy",
    pin: "3579",
    status: "Active"
  },
  {
    id: 19,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    name: "Benjamin Oteng",
    fullName: "Benjamin Oteng",
    licenseNumber: "DL567801234",
    phone: "+254 722 567 801",
    schoolName: "International School of Kenya",
    pin: "4680",
    status: "Active"
  },
  {
    id: 20,
    photo: "",
    name: "Kenneth Mwai",
    fullName: "Kenneth Mwai",
    licenseNumber: "DL678012345",
    phone: "+254 733 678 012",
    schoolName: "Aga Khan Academy",
    pin: "5791",
    status: "Active"
  }
];

const initialMinders: Minder[] = [
  {
    id: 1,
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
    name: "Sarah Wilson",
    fullName: "Sarah Wilson",
    phone: "+254 755 111 222",
    schoolName: "Springfield Elementary School",
    pin: "3456",
    status: "Active"
  },
  {
    id: 2,
    photo: "",
    name: "David Brown",
    fullName: "David Brown",
    phone: "+254 766 333 444",
    schoolName: "Oak Valley High School",
    pin: "7890",
    status: "Active"
  },
  {
    id: 3,
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
    name: "Lisa Davis",
    fullName: "Lisa Davis",
    phone: "+254 777 555 666",
    schoolName: "Maplewood Primary",
    pin: "1357",
    status: "Inactive"
  },
  {
    id: 4,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    name: "Mary Wanjiku",
    fullName: "Mary Wanjiku",
    phone: "+254 755 234 567",
    schoolName: "Nairobi Primary School",
    pin: "2468",
    status: "Active"
  },
  {
    id: 5,
    photo: "",
    name: "Grace Achieng",
    fullName: "Grace Achieng",
    phone: "+254 766 345 678",
    schoolName: "Brookhouse School",
    pin: "3579",
    status: "Active"
  },
  {
    id: 6,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    name: "Faith Muthoni",
    fullName: "Faith Muthoni",
    phone: "+254 777 456 789",
    schoolName: "Braeburn School",
    pin: "4680",
    status: "Active"
  },
  {
    id: 7,
    photo: "",
    name: "Alice Wambui",
    fullName: "Alice Wambui",
    phone: "+254 755 567 890",
    schoolName: "Moi Educational Centre",
    pin: "5791",
    status: "Active"
  },
  {
    id: 8,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    name: "Joyce Nyambura",
    fullName: "Joyce Nyambura",
    phone: "+254 766 678 901",
    schoolName: "Hillcrest International School",
    pin: "6802",
    status: "Inactive"
  },
  {
    id: 9,
    photo: "",
    name: "Ruth Chebet",
    fullName: "Ruth Chebet",
    phone: "+254 777 789 012",
    schoolName: "St. Mary's School",
    pin: "7913",
    status: "Active"
  },
  {
    id: 10,
    photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face",
    name: "Esther Chepkorir",
    fullName: "Esther Chepkorir",
    phone: "+254 755 890 123",
    schoolName: "Alliance High School",
    pin: "8024",
    status: "Active"
  },
  {
    id: 11,
    photo: "",
    name: "Nancy Adhiambo",
    fullName: "Nancy Adhiambo",
    phone: "+254 766 901 234",
    schoolName: "Sunshine Academy",
    pin: "9135",
    status: "Active"
  },
  {
    id: 12,
    photo: "https://images.unsplash.com/photo-1578774296842-c45e472b3028?w=100&h=100&fit=crop&crop=face",
    name: "Mercy Wangari",
    fullName: "Mercy Wangari",
    phone: "+254 777 012 345",
    schoolName: "Greenvale School",
    pin: "0246",
    status: "Inactive"
  },
  {
    id: 13,
    photo: "",
    name: "Elizabeth Njeri",
    fullName: "Elizabeth Njeri",
    phone: "+254 755 123 456",
    schoolName: "Riverdale Academy",
    pin: "1357",
    status: "Active"
  },
  {
    id: 14,
    photo: "https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=100&h=100&fit=crop&crop=face",
    name: "Catherine Wangui",
    fullName: "Catherine Wangui",
    phone: "+254 766 234 567",
    schoolName: "Greenhill Academy",
    pin: "2468",
    status: "Active"
  },
  {
    id: 15,
    photo: "",
    name: "Beatrice Omondi",
    fullName: "Beatrice Omondi",
    phone: "+254 777 345 678",
    schoolName: "Starehe Boys Centre",
    pin: "3579",
    status: "Active"
  },
  {
    id: 16,
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
    name: "Jennifer Akinyi",
    fullName: "Jennifer Akinyi",
    phone: "+254 755 456 789",
    schoolName: "Kenya High School",
    pin: "4680",
    status: "Active"
  },
  {
    id: 17,
    photo: "",
    name: "Diana Moraa",
    fullName: "Diana Moraa",
    phone: "+254 766 567 890",
    schoolName: "Nairobi Academy",
    pin: "5791",
    status: "Inactive"
  },
  {
    id: 18,
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face",
    name: "Lucy Mwende",
    fullName: "Lucy Mwende",
    phone: "+254 777 678 901",
    schoolName: "Riara Springs Academy",
    pin: "6802",
    status: "Active"
  },
  {
    id: 19,
    photo: "",
    name: "Sharon Kioko",
    fullName: "Sharon Kioko",
    phone: "+254 755 789 012",
    schoolName: "International School of Kenya",
    pin: "7913",
    status: "Active"
  },
  {
    id: 20,
    photo: "https://images.unsplash.com/photo-1532171875345-9712d9d4f65a?w=100&h=100&fit=crop&crop=face",
    name: "Tabitha Mueni",
    fullName: "Tabitha Mueni",
    phone: "+254 766 890 123",
    schoolName: "Aga Khan Academy",
    pin: "8024",
    status: "Active"
  }
];

export const useFleetData = () => {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [minders, setMinders] = useState<Minder[]>(initialMinders);

  const addBus = (newBusData: FormItem) => {
    const newBus: Bus = {
      id: buses.length + 1,
      registrationNumber: newBusData.registrationNumber,
      busNumber: `B${String(buses.length + 1).padStart(3, '0')}`,
      licensePlate: newBusData.registrationNumber,
      schoolName: newBusData.schoolName,
      make: newBusData.make,
      model: newBusData.model,
      seatsCapacity: parseInt(newBusData.seatsCapacity) || 0,
      type: newBusData.type,
      status: newBusData.status,
      driver: "Not Assigned",
      minder: "Not Assigned"
    };
    setBuses([...buses, newBus]);
  };

  const addDriver = (newDriverData: FormItem) => {
    const newDriver: Driver = {
      id: drivers.length + 1,
      photo: newDriverData.photo || "",
      name: newDriverData.name,
      fullName: newDriverData.name,
      licenseNumber: `DL${Math.floor(100000000 + Math.random() * 900000000)}`,
      phone: newDriverData.phone,
      schoolName: newDriverData.schoolName,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      status: newDriverData.status
    };
    setDrivers([...drivers, newDriver]);
  };

  const addMinder = (newMinderData: FormItem) => {
    const newMinder: Minder = {
      id: minders.length + 1,
      photo: newMinderData.photo || "",
      name: newMinderData.name,
      fullName: newMinderData.name,
      phone: newMinderData.phone,
      schoolName: newMinderData.schoolName,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      status: newMinderData.status
    };
    setMinders([...minders, newMinder]);
  };

  const updateBus = (originalItem: Bus, updatedData: FormItem) => {
    setBuses(buses.map(bus => 
      bus.id === originalItem.id 
        ? {
            ...bus,
            registrationNumber: updatedData.registrationNumber,
            licensePlate: updatedData.registrationNumber,
            schoolName: updatedData.schoolName,
            make: updatedData.make,
            model: updatedData.model,
            seatsCapacity: parseInt(updatedData.seatsCapacity) || 0,
            type: updatedData.type,
            status: updatedData.status
          }
        : bus
    ));
  };

  const updateDriver = (originalItem: Driver, updatedData: FormItem) => {
    setDrivers(drivers.map(driver => 
      driver.id === originalItem.id 
        ? {
            ...driver,
            photo: updatedData.photo || driver.photo,
            name: updatedData.name,
            fullName: updatedData.name,
            phone: updatedData.phone,
            schoolName: updatedData.schoolName,
            status: updatedData.status
          }
        : driver
    ));
  };

  const updateMinder = (originalItem: Minder, updatedData: FormItem) => {
    setMinders(minders.map(minder => 
      minder.id === originalItem.id 
        ? {
            ...minder,
            photo: updatedData.photo || minder.photo,
            name: updatedData.name,
            fullName: updatedData.name,
            phone: updatedData.phone,
            schoolName: updatedData.schoolName,
            status: updatedData.status
          }
        : minder
    ));
  };

  const deleteBus = (busToDelete: Bus) => {
    setBuses(buses.filter(bus => bus.id !== busToDelete.id));
  };

  const deleteDriver = (driverToDelete: Driver) => {
    setDrivers(drivers.filter(driver => driver.id !== driverToDelete.id));
  };

  const deleteMinder = (minderToDelete: Minder) => {
    setMinders(minders.filter(minder => minder.id !== minderToDelete.id));
  };

  return {
    buses,
    drivers,
    minders,
    addBus,
    addDriver,
    addMinder,
    updateBus,
    updateDriver,
    updateMinder,
    deleteBus,
    deleteDriver,
    deleteMinder,
  };
};
