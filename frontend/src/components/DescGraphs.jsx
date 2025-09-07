import React, {useState} from 'react';
import  DescGraphSelector from './utils/DescGraphSelector';

import { DescriptionPie } from './charts/PieCharts';

import { groupByDescription} from './charts/utils/groupers';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./utils/AddRecordOps";

export default function DescGraphs( { rows } ) {
    const [incomeCategory, setIncomeCategory] = useState(Object.keys(INCOME_CATEGORIES)[0]);
    const [expenseCategory, setExpenseCategory] = useState(Object.keys(EXPENSE_CATEGORIES)[0]);

    const income_desc = groupByDescription(INCOME_CATEGORIES,incomeCategory,rows);
    const expense_desc = groupByDescription(EXPENSE_CATEGORIES,expenseCategory,rows);

    return (
        <>
        <DescGraphSelector incomeCategory={incomeCategory} 
            setIncomeCategory={setIncomeCategory}
            expenseCategory={expenseCategory}
            setExpenseCategory={setExpenseCategory}
        />
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-3">
                <DescriptionPie data={income_desc} type={"Income"} description={incomeCategory} />
                <DescriptionPie data={expense_desc} type={"Expense"} description={expenseCategory} />
            </div>
        </>
    );
}