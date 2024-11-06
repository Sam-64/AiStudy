import { EventData, Page } from '@nativescript/core';
import { StudyViewModel } from './view-models/study-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new StudyViewModel();
}