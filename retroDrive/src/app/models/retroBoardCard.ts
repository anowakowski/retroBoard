
export class RetroBoardCard {
    
    constructor(public name: string, public isEdit: boolean, public index: number) {}

    public isClickedFromCloseEdit: boolean;
    public isClickedFromVoteBtn: boolean;
    public isClickedFromMergeBtn: boolean;
    public isNewItem: boolean;
    public isInMerge: boolean
}