export const initialMembers = [
    { id: 'M001', name: 'Vikram Malhotra', phone: '9820012345', age: 29, email: 'vikram@example.com', plan: 'Premium', start: '2026-05-01', dur: '6', pay: 'paid' },
    { id: 'M002', name: 'Ananya Iyer', phone: '9123456780', age: 24, email: 'ananya@example.com', plan: 'Standard', start: '2026-04-15', dur: '1', pay: 'paid' },
    { id: 'M003', name: 'Rahul Sharma', phone: '9988776655', age: 31, email: 'rahul@example.com', plan: 'Basic', start: '2026-01-10', dur: '3', pay: 'pending' },
    { id: 'M004', name: 'Priya Das', phone: '9776655443', age: 27, email: 'priya@example.com', plan: 'Premium', start: '2026-05-10', dur: '12', pay: 'paid' },
    { id: 'M005', name: 'Siddharth Roy', phone: '9554433221', age: 35, email: 'sid@example.com', plan: 'Standard', start: '2026-05-05', dur: '1', pay: 'pending' },
    { id: 'M006', name: 'Meera Kapoor', phone: '9443322110', age: 22, email: 'meera@example.com', plan: 'Basic', start: '2026-05-12', dur: '1', pay: 'paid' },
    { id: 'M007', name: 'Arjun Verma', phone: '9332211009', age: 40, email: 'arjun@example.com', plan: 'Premium', start: '2026-02-01', dur: '3', pay: 'paid' }
];

export const gymPlans = {
    Basic: { 
        price: 800, 
        features: ['Gym Access', 'Locker Room'] 
    },
    Standard: { 
        price: 1200, 
        features: ['Gym Access', 'Locker Room', 'Personal Trainer (1 session/mo)', 'Group Classes'] 
    },
    Premium: { 
        price: 2000, 
        features: ['Gym Access', 'Locker Room', 'Personal Trainer (4 sessions/mo)', 'Group Classes', 'Diet Plan', 'Steam Bath']    }
};
