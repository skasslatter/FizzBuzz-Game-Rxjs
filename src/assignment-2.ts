import { interval } from 'rxjs';
import { scan, pluck } from 'rxjs/operators';

const interval$ = interval(100);
const fibonacci$ = interval$.pipe(
    scan(x => ({
        prev: x.current, 
        current: x.current + x.prev
    }), {
        prev: 0,
        current: 1,
    }),
    pluck('prev'),
);

export default fibonacci$;