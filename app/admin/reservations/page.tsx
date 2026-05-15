import { getAllReservations } from '../package/actions';
import ReservationsList from './ReservationsList';

export default async function AllReservationsPage() {
    const resResult = await getAllReservations();
    const reservations = resResult.success && resResult.data ? resResult.data : [];

    return <ReservationsList reservations={reservations} />;
}
