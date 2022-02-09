const {fromEvent, Subject, BehaviorSubject} = rxjs;
const {takeUntil, map} = rxjs.operators;

const documentReadyState$ = new BehaviorSubject(document.readyState);
const onUnsubscribe$ = new Subject();

fromEvent(document, 'readystatechange')
    .pipe(
        map((event) => event.target.readyState),
        takeUntil(onUnsubscribe$)
    )
    .subscribe(state => {
        documentReadyState$.next(state);

        if (event.target.readyState === 'complete') {
            markForUnsubscribe();
        }
    });

documentReadyState$
    .asObservable()
    .pipe(takeUntil(onUnsubscribe$))
    .subscribe(state => {
        checkLoadingState(state);
    });


function markForUnsubscribe() {
    if (documentReadyState$.getValue() === 'complete') {
        onUnsubscribe$.next();
        onUnsubscribe$.complete();
        documentReadyState$.complete();
    }
}

function checkLoadingState(state) {
    switch (state) {
        case 'loading':
            onLoading();
            break;
        case 'interactive':
            onInteractive();
            break;
        case 'complete':
            onCompleted();
            break;
    }
}

function onLoading() {
    console.log('Loading');
}

function onInteractive() {
    console.log('Interactive');
}

function onCompleted() {
    console.log('Completed');
}
