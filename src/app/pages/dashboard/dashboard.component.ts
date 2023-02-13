import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as moment from 'moment';
import { TenantService } from 'src/app/services/tenant.service';
import { PieChartsDataGateway } from 'src/app/models/dashboard';


@Component({
  templateUrl: './dashboard.component.html',
  providers: [MessageService]
})

export class DashboardComponent implements OnInit {
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults: any = true;
    date: any ;
    dashboard: any;
    chartData: any;
    data: any;
    today = new Date();
    rangeDates!: Date[];
    dateFilter!: any;
    @ViewChild("calendar") private calendar: any;
    @ViewChild('dt', { static: true }) dt!: any;
    @ViewChild('calendar') private daterang: any;
    tenantId: any;
    itemTenant: any = [];
    chartLegend: boolean = true;  
    chartType: any = 'line';
    chartType2: any = 'pie';
    chartOptions: any;
    ChartsDataGateway: any;
    PieChartsDataGateway: any;

    basicData: any;
    basicOptions: any;

    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _authService: AuthService,
        public _router: Router,
        public _dashboard: DashboardService,
        public _tenantService: TenantService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });

        this._tenantService.getTenant(100,0,"","","","").subscribe(
            res => {
                this.itemTenant = res.data;
            }
        );

        var yesterday = new Date(this.today.setDate(new Date().getDate()-1));
        this.dateFilter = moment(yesterday).format('MM/DD/YYYY');
    }
  
    ngOnInit(): void {
        if (!this._authService.isLoggedIn)
            window.location.href = '/login';

        this.initChartData("", "");

        // this._dashboard.getSaleSummaryByMonth().subscribe(res => {
        //     this.PieChartsDataGateway = res;
        // });

        this.basicData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#FFA726',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
                ,
                {
                    label: 'My Third dataset',
                    backgroundColor: '#DCDF1E',
                    data: [28, 48, 40, 19, 86, 34, 200]
                }
            ]
        };
    }

    OnLoadDataSource(event: any) {
      this.isLoadingResults = true;
      setTimeout(() => {
          this._dashboard.dashboard(this.date).then(res => {
            this.dashboard = res;
            this.isLoadingResults = false;
          });
      }, 3000);
    }

    openCalendar() {
        this.calendar.showOverlay();
        this.calendar.inputfieldViewChild.nativeElement.dispatchEvent(new Event('click'));
    }

    onDateChange(event:any) {
        this.date = moment(event).format('YYYY-MM-DD');
        this.dt.filterGlobal(event, 'contains');
    }

    onFilterByTenant(event: any) {
        if (event.value != null || event.value !== undefined) {
          this.tenantId = event.value;
          this.initChartData("", this.tenantId);
        }
    }

    onFilterByDate(event:any) {
        this.dateFilter = moment(event).format('MM/DD/YYYY');
        this.initChartData("", "");
    }

    initChartData(date: any, tenant: any) {
        this.isLoadingResults = true;
        setTimeout(() => {
            this._dashboard.getSaleSummaryByDay(this.dateFilter, tenant).subscribe(res => {
                this.ChartsDataGateway = res;
                this.isLoadingResults = false;
            });
        }, 3000);
    }
}