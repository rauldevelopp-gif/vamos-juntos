export const dynamic = 'force-dynamic';

import { getAllHotelReservations } from '../../hotels/actions';
import HotelReservationsList from './HotelReservationsList';

export default async function HotelReservationsPage() {
    const result = await getAllHotelReservations();
    const reservations = result.success && result.data ? result.data : [];

    return <HotelReservationsList reservations={reservations} />;
}
