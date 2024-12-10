import { CommitEvent, IdentityEvent, AccountEvent, Collection } from '@skyware/jetstream';
export interface Event {
    capture_time: Date;
    collection: string;
    record: CommitEvent<Collection> | IdentityEvent | AccountEvent;
}
