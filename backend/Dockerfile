FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Redacted.API.csproj", "./"]
RUN dotnet restore "Redacted.API.csproj"
COPY . .
RUN dotnet build "Redacted.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Redacted.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:3001
EXPOSE 3001
ENTRYPOINT ["dotnet", "Redacted.API.dll"]
